import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";




const firebaseConfig = {
    apiKey: "AIzaSyBRobOlLaFvcJMo2cnt-KXXl6XRoNE_4AQ",
    authDomain: "fireblog-91581.firebaseapp.com",
    projectId: "fireblog-91581",
    storageBucket: "fireblog-91581.appspot.com",
    messagingSenderId: "884704683007",
    appId: "1:884704683007:web:08d2a9912f772cbdfc7dca"
  };



  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore();
  const storage = getStorage(app);


  export { auth, db,storage };



// const app = initializeApp(firebaseConfig);






