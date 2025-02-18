import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Navbar from '../components/Navbar';

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
        // Fetch all events from the collection without filtering by creator
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

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm('Tüm etkinlikleri silmek istediğinizden emin misiniz?');
    if (!confirmDelete) return;
    try {
      for (const event of events) {
        await deleteDoc(doc(db, 'events', event.id));
      }
      alert('Tüm etkinlikler silindi.');
      setEvents([]);
    } catch (error) {
      alert('Silme işlemi başarısız: ' + error.message);
    }
  };

  if (!userInfo || userInfo.role !== 'admin') {
    return <p>Yükleniyor...</p>;
  }

  return (
    <>
      <Navbar />
      <h2>Yönetici Paneli - Tüm Etkinlikler</h2>
      {error && <p>Error: {error}</p>}
      <button onClick={handleDeleteAll}>Tüm Etkinlikleri Sil</button>
      {/* The list shows events from all profiles with delete capability */}
      {events.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={new Date(event.startDateTime).toLocaleString()}
          description={event.description}
          isCreator={false}
          showParticipationButton={false}
          handleDelete={() => handleDelete(event.id)}
          creatorName={event.creatorName}
        />
      ))}
    </>
  );
}

export default AdminPanel;
