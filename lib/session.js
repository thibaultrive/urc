import {kv} from "@vercel/kv";


export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authentication');
    if (token === undefined || token === null || token === "") {
<<<<<<< HEAD
        return false;
=======
        return null;
>>>>>>> origin/main
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await kv.get(token);
<<<<<<< HEAD
    // console.log("Got user : " + user.username);
=======
    console.log("Got user : " + user.username);
>>>>>>> origin/main
    return user;
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
<<<<<<< HEAD
    return (user !== undefined && user !== null);
=======
    // console.log(user);
    return (user !== undefined && user !== null && user);
>>>>>>> origin/main
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