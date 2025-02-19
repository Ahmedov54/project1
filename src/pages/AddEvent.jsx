import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';


function AddEvent() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const userInfo = useContext(UserContext);
  console.log(userInfo);

  useEffect(() => {
    const checkEmail = () => {
      if (userInfo === undefined) {
        // userInfo henüz yüklenmediyse beklemek için.
        return;
      }
      // admin veya eventadder yetkisi varsa erişime izin ver.
      if (auth.currentUser && userInfo && (userInfo?.role === 'admin' || userInfo?.role === 'eventadder')) {
        setIsAllowed(true);
      } else {
        alert('Bu sayfaya erişim izniniz yok.');
        navigate('/');
      }
    };

    checkEmail();
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventStartDateTime = new Date(`${startDate}T${startTime}`);
    const eventEndDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (eventStartDateTime < now) {
      alert('Geçmiş bir başlangıç tarihi ve saati giremezsiniz.');
      return;
    }

    if (eventEndDateTime < eventStartDateTime) {
      alert('Bitiş tarihi ve saati başlangıç tarihinden ve saatinden önce olamaz.');
      return;
    }

    if (!title || !startDate || !startTime || !endDate || !endTime || !description || !category) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      await addDoc(collection(db, 'events'), {
        title,
        startDateTime: eventStartDateTime.toISOString(),
        endDateTime: eventEndDateTime.toISOString(),
        description,
        category,
        participants: [],
        creator: auth.currentUser.email, // existing creator email
        creatorName: auth.currentUser.displayName, // new field for full name
        createdAt: new Date().toISOString() // added createdAt for publication timestamp
      });
      alert('Etkinlik başarıyla eklendi!');
      setTitle('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setDescription('');
      setCategory('');
      navigate('/'); // Başarılı ekleme sonrası ana sayfaya yönlendirme
    } catch (error) {
      alert('Etkinlik eklenemedi: ' + error.message);
    }
  };

  if (!isAllowed) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Etkinlik Ekle</h2>
      <input
        type="text"
        placeholder="Etkinlik Başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="" disabled>--Kategori Seçin--</option>
        <option value="spor">spor</option>
        <option value="sanat">sanat</option>
        <option value="edebiyat">edebiyat</option>
        <option value="matematik">matematik</option>
        <option value="bilim">bilim</option>
        <option value="diğer">diğer</option>
      </select>
      <textarea
        placeholder="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Ekle</button>
      <button type="button" onClick={() => navigate(-1)}>Geri Dön</button>
    </form>
  );
}

export default AddEvent;