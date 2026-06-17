import Navigation from './Navigation';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Stats from './Stats';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="w-full">
      <Navigation />
      <main className="pt-2xl overflow-x-hidden">
        <Hero />
        <HowItWorks />
        <Features />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
