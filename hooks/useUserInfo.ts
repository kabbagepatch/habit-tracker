import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { getAuth, firebaseAuth } from "@/firebaseApp";
let auth = getAuth() || firebaseAuth;

function useUserInfo() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { loading, user }
}

export default useUserInfo;
