import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/Stats";
import Services from "../components/Services";
import AppointmentForm from "../components/Appointment";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <AppointmentForm />
        <Testimonials />
      </main>
      
    </>
  );
}
