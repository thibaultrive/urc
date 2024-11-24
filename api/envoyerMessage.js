import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async (request) => {
    try {
        console.log("Handling /api/envoyerMessage request...");

        // Vérifier l'utilisateur connecté
        const user = await getConnecterUser(request);

        if (!user) {
            console.log("User not authenticated.");
            return triggerNotConnected();
        }

        // Extraire les données du corps de la requête
        const { receiver_id, content, receiver_type } = await request.json();

        console.log("Received data:", { receiver_id, content, receiver_type });

        if (!receiver_id || !content || !receiver_type) {
            return new Response(
                JSON.stringify({ error: "Receiver ID, content, and receiver type are required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        let receiverResult =``;
        if (receiver_type === 'user')
            { receiverResult = await db.sql`
            SELECT user_id 
            FROM users 
            WHERE user_id = ${receiver_id};`
        ;}else{
             receiverResult = await db.sql`
            SELECT room_id 
            FROM rooms 
            WHERE room_id = ${receiver_id};`
            }

            console.log('sdnsqdklqsld '+ receiverResult);
        if (receiverResult.rowCount === 0) {
            console.log("Receiver not found.");
            return new Response(
                JSON.stringify({ error: "Receiver not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Sauvegarder le message dans la base de données
        const result = await db.sql`
            INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type)
            VALUES (${user.id}, ${user.username}, ${receiver_id}, ${content}, ${receiver_type})
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            console.log("Failed to save the message.");
            return new Response(
                JSON.stringify({ error: "Message could not be saved." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }



        console.log("Message saved:", result.rows[0]);
        return new Response(
            JSON.stringify({ data: result.rows[0] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
          
        /*const sendPushNotification = async (externalIds, message, sender) => {
            try {
                await beamsClient.publishToUsers(externalIds, {
                    web: {
                        notification: {
                            title: sender.username,
                            body: message.content,
                            icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                        },
                        data: {
                            senderId: sender.id,
                            receiver_Id: receiver_id,
                            receiverType: receiver_type,
                            messageId: message.message_id,
                        },
                    },
                });
                console.log('Notification sent');
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        };

        if (receiver_type === 'group') {
            // Récupérer tous les utilisateurs, sauf l'expéditeur
            const allUsersResult = await db.sql`
                SELECT external_id 
                FROM users 
                WHERE user_id != ${user.id};
            `;

            if (allUsersResult.rowCount > 0) {
                const externalIds = allUsersResult.rows.map(row => row.external_id);
                await sendPushNotification(externalIds, savedMessage, user);
            }
        } else if (receiver_type === 'user') {
            // Récupérer l'ID externe de l'utilisateur destinataire
            const receiverResult = await db.sql`
                SELECT external_id
                FROM users
                WHERE user_id = ${receiver_id};
            `;

            if (receiverResult.rowCount > 0) {
                const receiverExternalId = receiverResult.rows[0].external_id;
                await sendPushNotification([receiverExternalId], savedMessage, user);
            } else {
                return response.status(404).json({ error: "Receiver not found." });
            }
        }*/


    } catch (error) {
        console.error("Error in /api/envoyerMessage:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred while saving the message.", details: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
