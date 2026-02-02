import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImmigrationPathways from '@/components/ImmigrationPathways';
import JobListings from '@/components/JobListings';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ImmigrationPathways />
        <JobListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
