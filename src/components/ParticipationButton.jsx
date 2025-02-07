import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

function ParticipationButton({ eventId, isParticipating }) {
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkIfCreator = async () => {
      if (!auth.currentUser) return;
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists() && eventDoc.data().creator === auth.currentUser.email) {
        setIsCreator(true);
      }
    };

    checkIfCreator();
  }, [eventId]);

  const handleParticipation = async () => {
    if (!auth.currentUser) {
      alert('Lütfen giriş yapın.');
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(auth.currentUser.email)
      });
      alert('Katılım isteği gönderildi!');
    } catch (error) {
      alert('Katılım isteği gönderilemedi: ' + error.message);
    }
  };

  const handleExit = async () => {
    if (!auth.currentUser) {
      alert('Lütfen giriş yapın.');
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        participants: arrayRemove(auth.currentUser.email)
      });
      alert('Etkinlikten çıkış yapıldı!');
    } catch (error) {
      alert('Çıkış işlemi gerçekleştirilemedi: ' + error.message);
    }
  };

  if (isCreator) {
    return null;
  }

  return (
    <>
      {isParticipating ? (
        <button onClick={handleExit}>Çık</button>
      ) : (
        <button onClick={handleParticipation}>Katıl</button>
      )}
    </>
  );
}

export default ParticipationButton;