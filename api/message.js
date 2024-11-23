import { checkSession, unauthorizedResponse } from "../lib/session";
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

        if (!receiver_id) {
            console.warn("Paramètre 'receiver_id' manquant");
            return new Response(
                JSON.stringify({ error: "Receiver ID is required" }),
                {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                }
            );
        }

        console.log(`Utilisateur connecté : ${connected.id}`);
        console.log(`Receiver ID reçu : ${receiver_id}`);

        // Requête SQL
        const { rowCount, rows } = await sql`
            SELECT 
                message_id, 
                sender_id, 
                receiver_id, 
                sender_name,
                content, 
                TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS created_at
            FROM messages
            WHERE (CAST(sender_id AS TEXT) = ${String(connected.id)} AND CAST(receiver_id AS TEXT) = ${String(receiver_id)})
            OR (CAST(sender_id AS TEXT) = ${String(receiver_id)} AND CAST(receiver_id AS TEXT) = ${String(connected.id)})
            ORDER BY created_at ASC;
        `;
    



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
};
