import {Session, SessionCallback, ErrorCallback, User} from "../model/common";
import {CustomError} from "../model/CustomError";

<<<<<<< HEAD

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
  
=======
export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
>>>>>>> origin/main
    fetch("/api/login",
        {
            method: "POST", // ou 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json() as Session;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                onResult(session)
<<<<<<< HEAD
               

=======
>>>>>>> origin/main
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}