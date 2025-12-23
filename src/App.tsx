import { BrowserRouter, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RootLayout from './components/RootLayout';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';
import StylesPage from './pages/StylesPage';
import ExportManager from './components/ExportManager';

function InnerApp() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="styles" element={<StylesPage />} />
          <Route path="export" element={<div className="section-padding max-w-4xl mx-auto"><ExportManager /></div>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

export default App;
