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
        if (user === null) {
            console.log("No user is connected.");
            return false;  // Retourne false si l'utilisateur n'est pas trouvé
        }

        console.log("User connected: " + user.username);
        return true;  // Si un utilisateur est trouvé, retourne true
    } catch (error) {
        console.error("Error checking session:", error);  // Log l'erreur pour le débogage
        return false;  // Retourne false si une erreur se produit
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