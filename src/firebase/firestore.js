import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtTYLGameebUEobsXQz_zj3I5rBpzNipU",
  authDomain: "react-native-project-806fa.firebaseapp.com",
  projectId: "react-native-project-806fa",
  storageBucket: "react-native-project-806fa.appspot.com",
  messagingSenderId: "635268778858",
  appId: "1:635268778858:web:3608df9eab171aab9d7313",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
