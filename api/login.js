import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";
import {arrayBufferToBase64, stringToArrayBuffer} from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const {username, password} = await request.json();
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        const client = await db.connect();
        const {rowCount, rows} = await client.sql`select * from users where username = ${username} and password = ${hashed64}`;
        if (rowCount !== 1) {
            const error = {code: "UNAUTHORIZED", message: "Identifiant ou mot de passe incorrect"};
            return new Response(JSON.stringify(error), {
                status: 401,
                headers: {'content-type': 'application/json'},
            });
        } else {
            await client.sql`update users set last_login = now() where user_id = ${rows[0].user_id}`;
            const token = crypto.randomUUID().toString();
            const user = {id: rows[0].user_id, username: rows[0].username, email: rows[0].email, externalId: rows[0].external_id}
            await kv.set(token, user, { ex: 3600 });
            const userInfo = {};
            userInfo[user.id] = user;
            await kv.hset("users", userInfo);

            return new Response(JSON.stringify({token: token, username: username, externalId: rows[0].external_id, id: rows[0].user_id}), {
                status: 200,
                headers: {'content-type': 'application/json'},
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {'content-type': 'application/json'},
        });
    }
};
