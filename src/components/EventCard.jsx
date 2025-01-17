function EventCard({ title, date, description }) {
    return (
      <div className="event-card">
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{description}</p>
      </div>
    );
  }
  
  export default EventCard;
  