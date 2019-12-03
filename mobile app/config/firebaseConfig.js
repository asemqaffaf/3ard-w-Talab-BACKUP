import firebase from "../node_modules/@firebase/app";
import "../node_modules/@firebase/storage";

var Config = {
  apiKey: "AIzaSyCcZgU21OQuN0sDfWZtzfrwoV4IuXjP_oA",
  authDomain: "ard-w-taleb.firebaseapp.com",
  databaseURL: "https://ard-w-taleb.firebaseio.com",
  projectId: "ard-w-taleb",
  storageBucket: "ard-w-taleb.appspot.com",
  messagingSenderId: "844381537042",
  appId: "1:844381537042:web:e64056c1642bdc1b05a9cb",
  measurementId: "G-GN14TWJRHC"
};

firebase.initializeApp(Config);

const storage = firebase.storage();
export { storage, firebase as default };

