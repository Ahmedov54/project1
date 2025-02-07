import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

function Profile() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
      setUserName(auth.currentUser.displayName || 'Anonim');
    }

    const fetchCreatedEvents = async () => {
      if (!auth.currentUser) return;

      const q = query(collection(db, 'events'), where('creator', '==', auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCreatedEvents(eventsList);
    };

    const fetchParticipatedEvents = async () => {
      if (!auth.currentUser) return;

      const q = query(collection(db, 'events'), where('participants', 'array-contains', auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filteredEventsList = eventsList.filter(event => event.creator !== auth.currentUser.email);
      setParticipatedEvents(filteredEventsList);
    };

    fetchCreatedEvents();
    fetchParticipatedEvents();
  }, []);

  return (
    <>
      <Navbar />
      <h2>Profil Sayfası</h2>
      <p>Giriş Yapan Kullanıcı: {userName} ({userEmail})</p>
      <p>Kayıt olduğunuz etkinlikleri burada görebilirsiniz.</p>
      <h3>Oluşturduğunuz Etkinlikler</h3>
      {createdEvents.map(event => (
        <EventCard key={event.id} id={event.id} title={event.title} date={event.date} description={event.description} isCreator={true} />
      ))}
      <h3>Katıldığınız Etkinlikler</h3>
      {participatedEvents.map(event => (
        <EventCard key={event.id} id={event.id} title={event.title} date={event.date} description={event.description} showParticipationButton={true} isParticipating={true} />
      ))}
    </>
  );
}

export default Profile;
