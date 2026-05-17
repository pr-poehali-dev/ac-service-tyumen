import Navbar from "@/components/landing/Navbar";
import HeroSections from "@/components/landing/HeroSections";
import BookingSection from "@/components/landing/BookingSection";
import ContactsSection from "@/components/landing/ContactsSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-golos overflow-x-hidden">
      <Navbar />
      <HeroSections />
      <BookingSection />
      <ContactsSection />
    </div>
  );
}