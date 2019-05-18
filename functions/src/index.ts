import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const deleteUser = functions.https.onRequest((request, response) => {
    const id = request.body.uid;
    admin.auth().deleteUser(id)
        .then(function() {
            response.json('ok')
        })
        .catch(function(error) {
            response.json(error)
        });
});
