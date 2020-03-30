import * as admin from "firebase-admin";

function initializeFirebaseAdmin(){

    var serviceAccount = require("../../credentials/firebase-adminsdk.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "" // todo provide real
    });

}

export{
    initializeFirebaseAdmin
}