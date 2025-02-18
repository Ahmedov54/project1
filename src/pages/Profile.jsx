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

  // New sort and filter states for each section
  const [sortCreated, setSortCreated] = useState('startAsc');
  const [sortParticipated, setSortParticipated] = useState('startAsc');
  const [filterCreated, setFilterCreated] = useState('all');
  const [filterParticipated, setFilterParticipated] = useState('all');

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

  // Helper function to sort events
  const sortEvents = (list, criteria) => {
    return [...list].sort((a, b) => {
      const aStart = new Date(a.startDateTime);
      const bStart = new Date(b.startDateTime);
      const aCreated = new Date(a.createdAt);
      const bCreated = new Date(b.createdAt);
      switch(criteria) {
        case 'startAsc':
          if(aStart.getTime() !== bStart.getTime()) return aStart - bStart;
          return bCreated - aCreated;
        case 'startDesc':
          if(aStart.getTime() !== bStart.getTime()) return bStart - aStart;
          return bCreated - aCreated;
        case 'createdAsc':
          if(aCreated.getTime() !== bCreated.getTime()) return aCreated - bCreated;
          return aStart - bStart;
        case 'createdDesc':
          if(aCreated.getTime() !== bCreated.getTime()) return bCreated - aCreated;
          return aStart - bStart;
        default:
          return 0;
      }
    });
  };

  const sortedCreatedEvents = sortEvents(createdEvents, sortCreated);
  const sortedParticipatedEvents = sortEvents(participatedEvents, sortParticipated);

  // Apply filtering based on selected category
  const filteredCreatedEvents = sortedCreatedEvents.filter(event => filterCreated === 'all' || event.category === filterCreated);
  const filteredParticipatedEvents = sortedParticipatedEvents.filter(event => filterParticipated === 'all' || event.category === filterParticipated);

  return (
    <>
      <Navbar />
      <h2>Profil Sayfası</h2>
      <p>Giriş Yapan Kullanıcı: {userName} ({userEmail})</p>
      <p>Kayıt olduğunuz etkinlikleri burada görebilirsiniz.</p>
      
      <h3>Oluşturduğunuz Etkinlikler</h3>
      {/* Sorting control for created events */}
      <div>
        <label>Sıralama: </label>
        <select value={sortCreated} onChange={(e) => setSortCreated(e.target.value)}>
          <option value="startAsc">Başlangıç Zamanı (Artan)</option>
          <option value="startDesc">Başlangıç Zamanı (Azalan)</option>
          <option value="createdAsc">Yayınlanma Zamanı (Artan)</option>
          <option value="createdDesc">Yayınlanma Zamanı (Azalan)</option>
        </select>
      </div>
      {/* Filtering control for created events */}
      <div>
        <label>Filtre: </label>
        <select value={filterCreated} onChange={(e) => setFilterCreated(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="spor">spor</option>
          <option value="sanat">sanat</option>
          <option value="edebiyat">edebiyat</option>
          <option value="matematik">matematik</option>
          <option value="bilim">bilim</option>
          <option value="diğer">diğer</option>
        </select>
      </div>
      {filteredCreatedEvents.map(event => (
        <EventCard 
          key={event.id} 
          id={event.id} 
          title={event.title} 
          date={event.date} 
          description={event.description} 
          category={event.category}
          creatorName={event.creatorName} 
          isCreator={true}
          participants={event.participants}  // new prop
        />
      ))}
      
      <h3>Katıldığınız Etkinlikler</h3>
      {/* Sorting control for participated events */}
      <div>
        <label>Sıralama: </label>
        <select value={sortParticipated} onChange={(e) => setSortParticipated(e.target.value)}>
          <option value="startAsc">Başlangıç Zamanı (Artan)</option>
          <option value="startDesc">Başlangıç Zamanı (Azalan)</option>
          <option value="createdAsc">Yayınlanma Zamanı (Artan)</option>
          <option value="createdDesc">Yayınlanma Zamanı (Azalan)</option>
        </select>
      </div>
      {/* Filtering control for participated events */}
      <div>
        <label>Filtre: </label>
        <select value={filterParticipated} onChange={(e) => setFilterParticipated(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="spor">spor</option>
          <option value="sanat">sanat</option>
          <option value="edebiyat">edebiyat</option>
          <option value="matematik">matematik</option>
          <option value="bilim">bilim</option>
          <option value="diğer">diğer</option>
        </select>
      </div>
      {filteredParticipatedEvents.map(event => (
        <EventCard 
          key={event.id} 
          id={event.id} 
          title={event.title} 
          date={event.date} 
          description={event.description} 
          category={event.category}
          creatorName={event.creatorName} 
          showParticipationButton={true} 
          isParticipating={true}
          participants={event.participants}  // new prop
        />
      ))}
    </>
  );
}

export default Profile;
