import { ParallaxProvider } from 'react-scroll-parallax';
import FirstPanel from '../components/FirstPanel';
import SecondPanel from '../components/SecondPanel';
import ThirdPanel from '../components/ThirdPanel';
import Footer from '../components/Footer';
import BlogsPage from './BlogsPage';
import { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';

function useHashPath() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash.replace(/^#\/?/, '');
}

function Router() {
  const path = useHashPath();
  if (path.startsWith('blogs') || path === 'blogs') {
    return <>
      <Topbar />
      <BlogsPage />
    </>;
  }
  return (
    <>
      <Topbar />
      <ParallaxProvider>
        <FirstPanel />
        <SecondPanel />
        <ThirdPanel />
        <Footer />
      </ParallaxProvider>
    </>
  );
}
function App() {
  return <Router />;
}

export default App;
