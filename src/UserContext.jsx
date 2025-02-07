import { createContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(false);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          // Kullanıcı belgesi yoksa oluştur
          const userData = {
            email: user.email,
            name: user.displayName || 'Anonim',
            role: 'user' // Varsayılan rol
          };
          await setDoc(userDocRef, userData);
          setUserInfo(userData);
        }
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  );
};