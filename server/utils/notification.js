// import admin from 'firebase-admin';
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, process.env.FIREBASE_SERVICE_JSON));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

/**
 * Sends a notification to multiple users.
 * @param {string} title - Notification title.
 * @param {string} description - Notification body.
 * @param {string[]} tokens - Array of FCM tokens.
 * @param {string} image - (Optional) Image URL.
 */
// const sendNotification = async (title, description, tokens = [], image = '') => {
//     if (!Array.isArray(tokens) || tokens.length === 0) {
//         console.error('No valid tokens provided for notification.');
//         return;
//     }

//     const message = {
//         notification: {
//             title: title,
//             body: description,
//             image: image || undefined,
//         },
//         tokens: tokens,
//     };

//     try {
//         const response = await messaging.sendMulticast(message);

//         if (response.failureCount > 0) {
//             response.responses.forEach((resp, idx) => {
//                 if (!resp.success) {
//                     nlogger.info(`Token ${tokens[idx]}: ${resp.error}`);
//                 }
//             });
//         }

//     } catch (error) {
//         console.info('❌ Error sending notification:', error);
//         // nlogger.info(`Notification failed: ${error}`);
//     }
// }

const sendNotification = async (title, description, tokens = [], image = '') => {
    if (!Array.isArray(tokens) || tokens.length === 0) {
        console.error('No valid tokens provided for notification.');
        return;
    }

    const message = {
        notification: {
            title,
            body: description,
            image: image || undefined,
        },
        tokens, // list of FCM tokens
    };

    try {
        const response = await messaging.sendEachForMulticast(message);

        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(`Token ${tokens[idx]}: ${resp.error}`);
                }
            });
        }

    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


module.exports = sendNotification
