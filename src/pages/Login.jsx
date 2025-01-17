import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Giriş başarılı!');
    } catch (error) {
      alert('Giriş başarısız: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Google ile giriş başarılı!');
    } catch (error) {
      alert('Google ile giriş başarısız: ' + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        <h2>Giriş Yap</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
      <button onClick={handleGoogleLogin}>Google ile Giriş Yap</button>
    </div>
  );
}

export default Login;
