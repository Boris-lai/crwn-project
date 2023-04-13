import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
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

initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();

// Google 登入的 Provider
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const db = getFirestore();

// 從 Auth 創建使用者資料，addtionalInformation : 假設得到一些額外訊息
export const createUserDocumentFromAuth = async (userAuth, addtionalInformation = {}) => {

  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

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
        ...addtionalInformation // 自己添加額外的訊息(displayName)
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  
  return await createUserWithEmailAndPassword(auth, email, password) // firebase的函數
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  
  return await signInWithEmailAndPassword(auth, email, password)  // firebase的函數
}