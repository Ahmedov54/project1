import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Etkinliği silmek istediğinizden emin misiniz?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'events', id));
        setEvents(events.filter(event => event.id !== id));
        alert('Etkinlik silindi.');
      } catch (error) {
        alert('Etkinlik silinemedi: ' + error.message);
      }
    }
  };

  if (!userInfo || userInfo.role !== 'admin') {
    return <p>Yükleniyor...</p>;
  }

  return (
    <>
      <h2>Yönetici Paneli</h2>
      {error && <p>Error: {error}</p>}
      {events.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={new Date(event.startDateTime).toLocaleString()}
          description={event.description}
          isCreator={event.creator === auth.currentUser.email}
          showParticipationButton={false}
          handleDelete={() => handleDelete(event.id)}
        />
      ))}
    </>
  );
}

export default AdminPanel;
