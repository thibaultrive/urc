import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization');
    if (token === undefined || token === null || token === "") {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await redis.get(token);
    console.log("Got user : " + user.username);
    return user;
}
// 
export async function checkSession(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("No user is connected.");
            return null; // Retournez null au lieu de false
        }

        console.log("User connected:", user.username);
        return user; // Retournez l'utilisateur au lieu d'un booléen
    } catch (error) {
        console.error("Error checking session:", error);
        return null; // Retournez null en cas d'erreur
    }
}


export function unauthorizedResponse() {
    const error = {code: "UNAUTHORIZED", message: "Session expired"};
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: {'content-type': 'application/json'},
    });
}

export function triggerNotConnected(res) {
    res.status(401).json("{code: \"UNAUTHORIZED\", message: \"Session expired\"}");
}