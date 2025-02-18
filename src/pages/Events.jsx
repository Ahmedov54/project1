import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import EventCard from '../components/EventCard';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('startAsc'); 
  const [filterCategory, setFilterCategory] = useState('all'); // new filter state

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

        // Update sorting based on detailed sortCriteria
        const sortedEventsList = validEventsList.sort((a, b) => {
          const aStart = new Date(a.startDateTime);
          const bStart = new Date(b.startDateTime);
          const aCreated = new Date(a.createdAt);
          const bCreated = new Date(b.createdAt);

          switch(sortCriteria) {
            case 'startAsc':
              // ascending start time then created descending
              if (aStart !== bStart) return aStart - bStart;
              return bCreated - aCreated;
            case 'startDesc':
              // descending start time then created descending
              if (aStart !== bStart) return bStart - aStart;
              return bCreated - aCreated;
            case 'createdAsc':
              // ascending createdAt then start ascending
              if (aCreated !== bCreated) return aCreated - bCreated;
              return aStart - bStart;
            case 'createdDesc':
              // descending createdAt then start ascending
              if (aCreated !== bCreated) return bCreated - aCreated;
              return aStart - bStart;
            default:
              return 0;
          }
        });

        setEvents(sortedEventsList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, [sortCriteria]); // re-run sort when sortCriteria changes

  // Filter events based on selected category
  const filteredEvents = events.filter(event => filterCategory === 'all' || event.category === filterCategory);

  return (
    <>
      <h2>Etkinlikler</h2>
      {/* Sorting control */}
      <div>
        <label>Sıralama: </label>
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
          <option value="startAsc">Başlangıç Zamanı (Artan)</option>
          <option value="startDesc">Başlangıç Zamanı (Azalan)</option>
          <option value="createdAsc">Yayınlanma Zamanı (Artan)</option>
          <option value="createdDesc">Yayınlanma Zamanı (Azalan)</option>
        </select>
      </div>
      {/* Filtering control */}
      <div>
        <label>Filtre: </label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="spor">spor</option>
          <option value="sanat">sanat</option>
          <option value="edebiyat">edebiyat</option>
          <option value="matematik">matematik</option>
          <option value="bilim">bilim</option>
          <option value="diğer">diğer</option>
        </select>
      </div>
      {error && <p>Error: {error}</p>}
      {filteredEvents.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={new Date(event.startDateTime).toLocaleString()}
          description={event.description}
          category={event.category}
          isCreator={event.creator === auth.currentUser.email}
          creatorName={event.creatorName}
          participants={event.participants}  // pass participants list
        />
      ))}
    </>
  );
}

export default Events;