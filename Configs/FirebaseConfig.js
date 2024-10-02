
import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
const firebaseConfig = {
  apiKey: "AIzaSyCVAVrvIDvbIpNtsAFJo2jN_oIYYIeiXnE",
  authDomain: "vtrack-12062.firebaseapp.com",
  projectId: "vtrack-12062",
  storageBucket: "vtrack-12062.appspot.com",
  messagingSenderId: "998934429512",
  appId: "1:998934429512:web:560335476f2bd780da7d7d"
};
let auth;
let db;
if(getApps().length==0){
  const app=initializeApp(firebaseConfig);
  db=getFirestore(app);
  auth=initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}else{
  db=getFirestore();
  auth=getAuth();
}

export {auth,db}