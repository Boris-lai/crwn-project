import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBj1pxbqcQ-E0uFmzinOQHsI-E9d35PLYc",
  authDomain: "crwn-project-db-76246.firebaseapp.com",
  projectId: "crwn-project-db-76246",
  storageBucket: "crwn-project-db-76246.appspot.com",
  messagingSenderId: "342768940549",
  appId: "1:342768940549:web:4caabbf1f6cbb92f308e6c",
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, "users", userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);

  console.log(userSnapshot);
  // userSnapshot.exists() 檢查資料庫中是否存在快照的實例
  console.log(userSnapshot.exists());

  // 檢查快照是否存在，如果沒有就創建使用者資料
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};
