import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAlI0ry78bM7HiWkUNRd8oWRdmgdVTcjJM",
  authDomain: "flood-monitoring-489dd.firebaseapp.com",
  databaseURL: "https://flood-monitoring-489dd-default-rtdb.firebaseio.com",
  projectId: "flood-monitoring-489dd",
  storageBucket: "flood-monitoring-489dd.firebasestorage.app",
  messagingSenderId: "978946933990",
  appId: "G-88235XTHEM"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
