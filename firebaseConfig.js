import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyARA1Vkbo_3fKtDc_Y-SI-ZjbzdRk3_DWE",
    authDomain: "clubcsia.firebaseapp.com",
    projectId: "clubcsia",
    storageBucket: "clubcsia.firebasestorage.app",
    messagingSenderId: "564814476885",
    appId: "1:564814476885:web:9b13329c140cb1dbaac6dc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };