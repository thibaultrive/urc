import { sql } from "@vercel/postgres";
import {checkSession, unauthorizedResponse} from "../lib/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {

        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const {rowCount, rows} = await sql`select user_id, username, TO_CHAR(last_login, 'DD/MM/YYYY HH24:MI') as last_login from users order by last_login desc`;
        console.log("Got " + rowCount + " users");
        if (rowCount === 0) {
            /* Vercel bug doesn't allow 204 response status */
            return new Response("[]", {
                status: 200,
                headers: {'content-type': 'application/json'},
            });
        } else {
            return new Response(JSON.stringify(rows), {
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
