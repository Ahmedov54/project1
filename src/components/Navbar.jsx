import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';


function Navbar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Çıkış başarılı!');
    } catch (error) {
      alert('Çıkış başarısız: ' + error.message);
    }
  };

  return (
    <nav>
      <h1>Okul Etkinlikleri</h1>
      <ul>
        <li><Link to="/">Anasayfa</Link></li>
        <li><Link to="/events">Etkinlikler</Link></li>
        <li><Link to="/profile">Profil</Link></li>
        <li><Link to="/admin">Yönetici Paneli</Link></li>
      </ul>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </nav>
  );
}

export default Navbar;
