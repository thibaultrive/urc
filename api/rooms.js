import { sql } from '@vercel/postgres';
import { checkSession, unauthorizedResponse } from '../lib/session';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // Vérification de la session pour assurer que l'utilisateur est authentifié
    const connected = await checkSession(request);
    if (!connected) {
      console.log("Not connected");
      return unauthorizedResponse();
    }

    // Récupérer tous les salons (rooms) depuis la base de données
    const { rowCount, rows } = await sql`
      SELECT room_id, name, TO_CHAR(created_on, 'DD/MM/YYYY HH24:MI') as created_on
      FROM rooms
      ORDER BY created_on DESC
    `;
    console.log("Got " + rowCount + " rooms");

    // Si aucun salon n'est trouvé
    if (rowCount === 0) {
      return new Response("[]", {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    } else {
      // Retourner les données des salons au format JSON
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch (error) {
    console.log(error);
    // En cas d'erreur, retourner une réponse avec le message d'erreur
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
