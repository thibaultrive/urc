import { checkSession, unauthorizedResponse } from "../lib/session.js";
import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        // Vérification de l'utilisateur connecté
        const connected = await checkSession(request);
        if (!connected) {
            console.error("Utilisateur non connecté");
            return unauthorizedResponse();
        }

        // Extraction des paramètres de l'URL
        const url = new URL(request.url);
        const receiver_id = url.searchParams.get("receiver_id");
        const receiver_type = url.searchParams.get("receiver_type");

        if (!receiver_id || !receiver_type) {
            console.warn("Paramètre 'receiver_id' ou 'receiver_type' manquant");
            return new Response(
                JSON.stringify({ error: "Receiver ID and Receiver Type are required" }),
                {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                }
            );
        }

        console.log(`Utilisateur connecté : ${connected.id}`);
        console.log(`Receiver Type : ${receiver_type}, Receiver ID : ${receiver_id}`);

        // Construction de la requête SQL avec logique conditionnelle
        let query = `
            SELECT 
                message_id, 
                sender_id, 
                sender_name, 
                receiver_id, 
                content, 
                TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS created_at
            FROM messages
            WHERE receiver_type = $1
              AND (receiver_id = $2 OR sender_id = $2)
        `;

        const params = [receiver_type, receiver_id];

        // Ajouter une condition supplémentaire si le type est 'user'
        if (receiver_type === 'user') {
            query += `
              AND (sender_id = $3 OR receiver_id = $3)
            `;
            params.push(connected.id);
        }

        query += ` ORDER BY created_at ASC`;

        console.log("Requête SQL générée :", query);
        console.log("Paramètres de la requête :", params);

        // Exécution de la requête SQL
        const { rowCount, rows } = await sql.query(query, params);

        console.log(`Messages récupérés : ${rowCount}`);

        // Retourne les résultats au frontend
        return new Response(
            JSON.stringify({
                messages: rows || [],
                rowCount: rowCount,
            }),
            {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        return new Response(
            JSON.stringify({ error: "Internal server error", details: error.message }),
            {
                status: 500,
                headers: { 'content-type': 'application/json' },
            }
        );
    }
}
