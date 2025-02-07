import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { UserContext } from '../UserContext';

function Navbar() {
  const userInfo = useContext(UserContext);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Çıkış başarılı!');
    } catch (error) {
      alert('Çıkış başarısız: ' + error.message);
    }
  };
console.log(userInfo)
  return (
    <nav>
      <h1>Okul Etkinlikleri</h1>
      <ul>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/profile">Profil</Link></li>
        <li><Link to="/add-event">Etkinlik Ekle</Link></li>
       {userInfo?.role === "admin" &&  <li><Link to="/admin">Admin Panel</Link></li>}
      </ul>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </nav>
  );
}

export default Navbar;
