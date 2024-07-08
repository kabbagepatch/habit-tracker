import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: '',
  authDomain: 'habitsapi-426700.firebaseapp.com',
  projectId: 'habitsapi-426700',
  storageBucket: 'habitsapi-426700.appspot.com',
  messagingSenderId: '472591136365',
  appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
  measurementId: 'G-TF2VLVQTLR'
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
