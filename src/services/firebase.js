const firebase = require('firebase/app');
require('firebase/firestore')

 var firebaseConfig = {
    apiKey: "AIzaSyCCvlqt74qwtdIz5ZCW1Sjp1QHblKTzrc8",
    authDomain: "gti-forms.firebaseapp.com",
    databaseURL: "https://gti-forms.firebaseio.com",
    projectId: "gti-forms",
    storageBucket: "gti-forms.appspot.com",
    messagingSenderId: "779298275079",
    appId: "1:779298275079:web:6703e1d7dad805fc88cfa2"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()

module.exports = {
    db,
    forms: db.collection("forms").doc('gti'),
};
