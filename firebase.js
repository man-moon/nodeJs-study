// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase-admin");
var serviceAccount = require("./firebaseKey.json");


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  });

module.exports = firebase;