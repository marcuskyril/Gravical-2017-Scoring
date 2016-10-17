import firebase from 'firebase';

try {
    var config = {
        apiKey: "AIzaSyCq8Ww6PAF-7xYOTIXnEU6-ykJWipxKPJ0",
        authDomain: "ortsolutions-77549.firebaseapp.com",
        databaseURL: "https://ortsolutions-77549.firebaseio.com",
        storageBucket: "ortsolutions-77549.appspot.com",
    };
    firebase.initializeApp(config);
} catch (e) {
    console.log("pfft", e);
}

export var firebaseRef = firebase.database().ref();
export default firebase;
