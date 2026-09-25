import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VoiceInteractionView } from './components/voice/VoiceInteractionView';
import { LiveClassroom } from './components/classroom/LiveClassroom';
import { WeeklyScheduleView } from './components/schedule/WeeklyScheduleView';
import { VideoLibrary } from './components/videos/VideoLibrary';
import { CodingLab } from './components/coding/CodingLab';
import { QuizCenter } from './components/quiz/QuizCenter';
import { BadgeSystem } from './components/progress/BadgeSystem';
import { StudyTools } from './components/tools/StudyTools';
import { EducationalGames } from './components/games/EducationalGames';
import { DrawingBoard } from './components/whiteboard/DrawingBoard';
import { SettingsModal } from './components/settings/SettingsModal';
import { UnitExplorer } from './components/units/UnitExplorer';
import { ArticleLibrary } from './components/articles/ArticleLibrary';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not authenticated, show landing page with authentication guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <LandingPage />
        <AuthModal />
        <SettingsModal />
      </div>
    );
  }

  // Render active classroom screen
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'unit-explorer':
        return <UnitExplorer />;
      case 'articles':
        return <ArticleLibrary />;
      case 'voice-mode':
        return <VoiceInteractionView />;
      case 'live-classroom':
        return <LiveClassroom />;
      case 'schedule':
        return <WeeklyScheduleView />;
      case 'videos':
        return <VideoLibrary />;
      case 'coding':
        return <CodingLab />;
      case 'quiz':
        return <QuizCenter />;
      case 'games':
        return <EducationalGames />;
      case 'badges':
        return <BadgeSystem />;
      case 'study-tools':
        return <StudyTools />;
      case 'whiteboard':
        return <DrawingBoard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveScreen()}
        </main>
      </div>

      <AuthModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
