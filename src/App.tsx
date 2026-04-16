import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MarkdownViewer } from './components/MarkdownViewer';
import { SpeakersPage } from './components/SpeakersPage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-x-clip">
        <div key={location.pathname} className="animate-fadeIn">
          <Routes location={location}>
            <Route path="/" element={<MarkdownViewer filename="home.md" />} />
            <Route path="/organisers" element={<MarkdownViewer filename="organisers.md" />} />
            <Route path="/CfP" element={<MarkdownViewer filename="cfp.md" showToc />} />
            <Route path="/programme" element={<MarkdownViewer filename="programme.md" />} />
            <Route path="/speakers" element={<SpeakersPage />} />
            <Route path="/challenges" element={<MarkdownViewer filename="challenges.md" showToc />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
