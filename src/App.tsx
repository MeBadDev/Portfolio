import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FirstPanel from './components/FirstPanel';
import SecondPanel from './components/SecondPanel';
import ThirdPanel from './components/ThirdPanel';
import Footer from './components/Footer';
import BlogsPage from './pages/BlogsPage';
import Topbar from './components/Topbar';
import NotFoundPage from './pages/404';

import ProjectsPage from './pages/ProjectsPage';

function HomePage() {
  return (
    <>
      <Topbar />
      {/* <ParallaxProvider> */}
        <FirstPanel />
        <SecondPanel />
        <ThirdPanel />
        <Footer />
      {/* </ParallaxProvider> */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<><Topbar /><BlogsPage /><Footer /></>} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
