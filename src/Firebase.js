// import { initializeApp } from "firebase/app"
// import { getAuth } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"

// const firebaseConfig = {
//   apiKey: "AIzaSyBJnTSIdsqj1UnueP_XmTfUKIRayqu6no8",
//   authDomain: "theminestocks.firebaseapp.com",
//   projectId: "theminestocks",
//   storageBucket: "theminestocks.appspot.com",
//   messagingSenderId: "249089323615",
//   appId: "1:249089323615:web:682e50c6369d0a2eaa61ea",
//   measurementId: "G-67VJYQKE6Z"
// };


 
// export const firebaseApp = initializeApp(firebaseConfig);

// export const auth = getAuth(firebaseApp)
// export const db = getFirestore()

import firebase from "firebase/firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBJnTSIdsqj1UnueP_XmTfUKIRayqu6no8",
  authDomain: "theminestocks.firebaseapp.com",
  projectId: "theminestocks",
  storageBucket: "theminestocks.appspot.com",
  messagingSenderId: "249089323615",
  appId: "1:249089323615:web:682e50c6369d0a2eaa61ea",
  measurementId: "G-67VJYQKE6Z"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const signInWithEmailAndPassword = async (email, password) => {
  try {
    return await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    return { error :err.message }
  }
};
const registerWithEmailAndPassword = async (fname, lname, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res?.user;
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      fname,
      lname,
      authProvider: "local",
      email,
    });
    return user
  } catch (err) {
    console.error(err);
    return { error :err.message }
  }
};
const sendPasswordResetEmail = async (email) => {
  try {
    const res = await auth.sendPasswordResetEmail(email);
    return { message:"Check your email for further process" }
  } catch (err) {
    console.error(err);
    return { error :err.message }
  }
  // try {
  //   await auth.sendPasswordResetEmail(email);
  //   alert("Password reset link sent!");
  // } catch (err) {
  //   console.error(err);
  //   alert(err.message);
  // }
};
const logout = () => {
  auth.signOut();
};
export {
  auth,
  db,
  signInWithGoogle,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};