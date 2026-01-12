import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import InteractiveApplicationForm from '@/components/InteractiveApplicationForm';
import Footer from '@/components/Footer';

const Apply = () => {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('job') || '';

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <InteractiveApplicationForm jobTitle={jobTitle} />
      </main>
      <Footer />
    </div>
  );
};

export default Apply;