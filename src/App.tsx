import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreatorsPage from './pages/CreatorsPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import StaffPage from './pages/StaffPage';
import RulesPage from './pages/RulesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import StorePage from './pages/StorePage';
import type { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(page);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'creators': return <CreatorsPage navigate={navigate} />;
      case 'leaderboards': return <LeaderboardsPage navigate={navigate} />;
      case 'staff': return <StaffPage navigate={navigate} />;
      case 'rules': return <RulesPage navigate={navigate} />;
      case 'applications': return <ApplicationsPage navigate={navigate} />;
      case 'store': return <StorePage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)]" dir="rtl">
      <Navbar currentPage={currentPage} navigate={navigate} />
      <main>{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
}
