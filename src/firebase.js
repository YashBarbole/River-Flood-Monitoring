// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlI0ry78bM7HiWkUNRd8oWRdmgdVTcjJM",
  authDomain: "flood-monitoring-489dd.firebaseapp.com",
  databaseURL: "https://flood-monitoring-489dd-default-rtdb.firebaseio.com",
  projectId: "flood-monitoring-489dd",
  storageBucket: "flood-monitoring-489dd.firebasestorage.app",
  messagingSenderId: "978946933990",
  appId: "1:978946933990:web:c85feb5f69ea35686a2727",
  measurementId: "G-88235XTHEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const database = getDatabase(app);