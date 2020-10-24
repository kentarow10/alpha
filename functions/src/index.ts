import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseTools = require('firebase-tools');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
// console.log(require.resolve('firebase-tools'));
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });
admin.initializeApp();

/**
 * Callable function that creates a custom auth token with the
 * custom attribute "admin" set to true.
 *
 * See https://firebase.google.com/docs/auth/admin/create-custom-tokens
 * for more information on creating custom tokens.
 *
 * @param {string} data.uid the user UID to set on the token.
 */
exports.mintAdminToken = functions.https.onCall((data, context) => {
  const uid = data.uid;

  return admin
    .auth()
    .createCustomToken(uid, { admin: true })
    .then(token => {
      return token;
    });
});

// [START recursive_delete_function]
/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall((data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth && context.auth.token)) {
      // if (!(context.auth && context.auth.token && context.auth.token.admin)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.',
      );
    }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`,
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firebaseTools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      })
      .then(() => {
        return {
          path: path,
        };
      });
  });
// [END recursive_delete_function]

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Expo } = require('expo-server-sdk');
// const expo = new Expo();

exports.notify = functions.firestore
  .document('users/{uid}/notes/{noteDoc}')
  .onCreate(async (snap, context) => {
    const { uid } = context.params;
    let token = '';

    const docRef = admin
      .firestore()
      .collection('users')
      .doc(uid);
    docRef
      .get()
      .then(async snapshot => {
        token = snapshot.data().noteToken;

        const newValue = snap.data();
        const cases = newValue.cases;
        const ms = newValue.message;
        let message = {};

        switch (cases) {
          case 'ANSWERED':
            message = {
              to: token,
              sound: 'default',
              title: 'アプリ名',
              body: ms,
              data: { name: 'foo', message: '回答されました！' + ms },
            };
            break;
          case 'COMMENTED':
            message = {
              to: token,
              sound: 'default',
              title: 'アプリ名',
              body: ms,
              data: { name: 'foo', message: 'コメントがつきました！' + ms },
            };
            break;
          case 'LINKED':
            message = {
              to: token,
              sound: 'default',
              title: 'アプリ名',
              body: ms,
              data: { name: 'foo', message: 'リンクされました！' + ms },
            };
            break;
          default:
            console.log(`Sorry, we are out of ${cases}.`);
        }
        console.log({ message });
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      })
      .catch(e => console.log(e));
  });
