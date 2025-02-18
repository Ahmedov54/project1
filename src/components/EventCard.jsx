import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import ParticipationButton from './ParticipationButton';

function EventCard({ 
  id, title, date, description, category, creatorName, creator, participants = [], showParticipationButton = true, isParticipating = false, isCreator = false,
  isAnonymous = false, isAdmin = false, handleDelete
}) {
  const [showPopup, setShowPopup] = useState(false);

  const internalHandleDelete = async () => {
    const confirmDelete = window.confirm('Etkinliği silmek istediğinizden emin misiniz?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'events', id));
        alert('Etkinlik silindi.');
      } catch (error) {
        alert('Etkinlik silinemedi: ' + error.message);
      }
    }
  };

  // Helper: format participant names.
  const formatParticipantName = (p) => {
    if (typeof p === 'object') {
      if (p.fullName) return p.fullName;
      if (p.displayName) return p.displayName;
    }
    return p;
  };

  const creatorFormatted = formatParticipantName(creatorName || creator || 'Bilinmiyor');
  
  let computedParticipants = participants.map(p => formatParticipantName(p));
  if (!computedParticipants.includes(creatorFormatted)) {
    computedParticipants.unshift(`${creatorFormatted} (Oluşturan)`);
  } else {
    computedParticipants = computedParticipants.map(name =>
      name === creatorFormatted ? `${name} (Oluşturan)` : name
    );
  }
  
  const sortedParticipants = [...computedParticipants].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <h3>
        {title} {isCreator && <span>(Sizin Etkinliğiniz)</span>}
      </h3>
      <p>{date}</p>
      <p>{description}</p>
      <p>Kategori: {category}</p>
      <p>Oluşturan: {creatorFormatted}</p>
      {showParticipationButton && <ParticipationButton eventId={id} isParticipating={isParticipating} />}
      {showParticipationButton && (
        isAnonymous ? (
          // Eğer kullanıcı etkinliği oluşturan ya da admin değilse anonim bildirimi göster
          isCreator || isAdmin ? (
            <button onClick={() => setShowPopup(true)}>Katılımcıları Göster</button>
          ) : (
            <p>Bu etkinlik anonimdir, katılımcı bilgileri gizlidir.</p>
          )
        ) : (
          sortedParticipants.length > 0 && (
            <button onClick={() => setShowPopup(true)}>Katılımcıları Göster</button>
          )
        )
      )}
      {(isCreator || handleDelete) && (
        <button onClick={handleDelete ? handleDelete : internalHandleDelete}>
          Etkinliği Sil
        </button>
      )}
      {showPopup && (
        <>
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }} onClick={() => setShowPopup(false)} />
          <div style={{
            position: 'fixed',
            top: '30%',
            left: '30%',
            width: '40%',
            backgroundColor: '#fff',
            border: '1px solid #000',
            padding: '20px',
            zIndex: 1000
          }}>
            <h4>Katılımcılar</h4>
            <ul>
              {sortedParticipants.map((p, idx) => <li key={idx}>{p}</li>)}
            </ul>
            <button onClick={() => setShowPopup(false)}>Kapat</button>
          </div>
        </>
      )}
    </div>
  );
}

export default EventCard;