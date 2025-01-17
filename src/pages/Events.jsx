import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <>
      <Navbar />
      <h2>Etkinlikler</h2>
      {events.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          date={event.date}
          description={event.description}
        />
      ))}
    </>
  );
}

export default Events;
