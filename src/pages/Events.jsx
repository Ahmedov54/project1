import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import EventCard from '../components/EventCard';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Bitiş tarihi ve saati gelen etkinlikleri sil
        const now = new Date();
        const validEventsList = [];
        for (const event of eventsList) {
          const eventEndDateTime = new Date(event.endDateTime);
          if (eventEndDateTime < now) {
            await deleteDoc(doc(db, 'events', event.id));
          } else {
            validEventsList.push(event);
          }
        }

        // Kullanıcının oluşturduğu etkinlikleri öncelikli olarak sıralayın
        const sortedEventsList = validEventsList.sort((a, b) => {
          if (a.creator === auth.currentUser.email && b.creator !== auth.currentUser.email) {
            return -1;
          }
          if (a.creator !== auth.currentUser.email && b.creator === auth.currentUser.email) {
            return 1;
          }
          return 0;
        });

        setEvents(sortedEventsList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <h2>Etkinlikler</h2>
      {error && <p>Error: {error}</p>}
      {events.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={new Date(event.startDateTime).toLocaleString()}
          description={event.description}
          isCreator={event.creator === auth.currentUser.email}
        />
      ))}
    </>
  );
}

export default Events;