import {kv} from "@vercel/kv";


export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authentication');
    if (token === undefined || token === null || token === "") {
        return false;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await kv.get(token);
    // console.log("Got user : " + user.username);
    return user;
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    return (user !== undefined && user !== null);
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