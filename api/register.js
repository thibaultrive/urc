import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();

        // Validate input fields
        if (!username || !email || !password) {
            const error = { code: "BAD_REQUEST", message: "Tous les champs sont obligatoires." };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const client = await db.connect();

        // Check if username or email already exists
        const { rowCount } = await client.sql`SELECT 1 FROM users WHERE username = ${username} OR email = ${email}`;
        if (rowCount > 0) {
            const error = { code: "CONFLICT", message: "Un utilisateur avec ce nom d'utilisateur ou email existe déjà." };
            return new Response(JSON.stringify(error), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Hash the password
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Generate an external_id
        const externalId = crypto.randomUUID().toString();

        // Save the new user to the database
        const { rowCount: insertCount } = await client.sql`
            INSERT INTO users (username, email, password, external_id)
            VALUES (${username}, ${email}, ${hashed64}, ${externalId})
        `;

        if (insertCount === 1) {
            // Option: Redirect to login or auto-login
            return new Response(JSON.stringify({ message: "Utilisateur enregistré avec succès." }), {
                status: 201,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            throw new Error("Erreur lors de l'insertion dans la base de données.");
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ code: "INTERNAL_ERROR", message: "Une erreur est survenue." }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
