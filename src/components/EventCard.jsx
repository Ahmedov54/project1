import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import ParticipationButton from './ParticipationButton';

function EventCard({ id, title, date, description, showParticipationButton = true, isParticipating = false, isCreator = false }) {
  const handleDelete = async () => {
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

  return (
    <div>
      <h3>
        {title} {isCreator && <span>(Sizin Etkinliğiniz)</span>}
      </h3>
      <p>{date}</p>
      <p>{description}</p>
      {showParticipationButton && <ParticipationButton eventId={id} isParticipating={isParticipating} />}
      {isCreator && <button onClick={handleDelete}>Etkinliği Sil</button>}
    </div>
  );
}

export default EventCard;