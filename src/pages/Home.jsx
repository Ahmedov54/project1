import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

function Home() {
  return (
    <>
      <Navbar />
      <h2>Yaklaşan Etkinlikler</h2>
      <EventCard title="Matematik Kulübü Toplantısı" date="2024-05-10" description="Matematik problemleri çözülecek." />
    </>
  );
}

export default Home;
