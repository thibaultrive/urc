import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function addUser(request) {
    try {
        const { username, password, email } = await request.json();
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password + email));
        const hashed64 = arrayBufferToBase64(hash);
        const client = await db.connect();

        // Utiliser prepared statements pour éviter les attaques par injection SQL
        const result = await client.query({
            text: 'SELECT * FROM users WHERE username = $1 AND password = $2',
            values: [username, hashed64],
        });

        if (result.rowCount !== 1) {
            // Utiliser un seul await pour l'insertion et récupération de l'utilisateur
            const insertResult = await client.query({
                text: 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
                values: [username, hashed64, email],
            });

            const user = insertResult.rows[0];
            const token = crypto.randomUUID().toString();

            await kv.set(token, user, { ttl: 3600 }); // Utiliser ttl au lieu de ex pour la durée de vie
            const userInfo = {};
            userInfo[user.id] = user;
            await kv.hset("users", userInfo);

            return new Response(JSON.stringify({
                token: token,
                username: user.username,
                externalId: user.external_id,
                id: user.user_id
            }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            const error = { code: "UNAUTHORIZED", message: "User already exists" };
            return new Response(JSON.stringify(error), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
