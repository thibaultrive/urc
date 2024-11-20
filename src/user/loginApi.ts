import {Session, SessionCallback, ErrorCallback, User} from "../model/common";
import {CustomError} from "../model/CustomError";

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
    const token = sessionStorage.getItem('token');
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    .then(async (response) => {
        if (response.ok) {
            const session = await response.json() as Session;

            // Log pour vérifier que les valeurs sont correctement reçues
            console.log("Session received:", session);
            sessionStorage.setItem('token', session.token);
            sessionStorage.setItem('externalId', session.externalId);
            sessionStorage.setItem('username', session.username || "");
            sessionStorage.setItem('user_id', session.id ? session.id.toString() : '');
 
            // Passe l'objet session avec user_id dans onResult
            onResult(session);
        } else {
            const error = await response.json() as CustomError;
            onError(error);
        }
    }, onError);
}
