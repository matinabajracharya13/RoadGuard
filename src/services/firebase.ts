import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyAFc5klRjiBQkQa-3TkyR-Hg3aYLf6XUW0"
const EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="roadguard-9b257.firebaseapp.com"
const EXPO_PUBLIC_FIREBASE_PROJECT_ID="roadguard-9b257"
const EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="roadguard-9b257.firebasestorage.app"
const EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="881982424869"
const EXPO_PUBLIC_FIREBASE_APP_ID="1:881982424869:web:bbef725921e4c033927ccc"

const firebaseConfig = {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_PUBLIC_FIREBASE_APP_ID,
};



const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const storage = getStorage(app);

export const db = getFirestore(app);