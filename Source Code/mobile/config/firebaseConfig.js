import firebase from "../node_modules/@firebase/app";
import "../node_modules/@firebase/storage";

const Config = {
  apiKey: "AIzaSyAkYkM1ZhMDE3I9Yp0mAcWGv4DQdR5m6J4",
  authDomain: "ard-w-talab-v2.firebaseapp.com",
  databaseURL: "https://ard-w-talab-v2.firebaseio.com",
  projectId: "ard-w-talab-v2",
  storageBucket: "ard-w-talab-v2.appspot.com",
  messagingSenderId: "55949324677",
  appId: "1:55949324677:web:dd462552b4151ad62894ec"
};

firebase.initializeApp(Config);

const storage = firebase.storage();
export { storage, firebase as default };
