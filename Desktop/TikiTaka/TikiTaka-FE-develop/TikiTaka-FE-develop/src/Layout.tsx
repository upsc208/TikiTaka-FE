import {useEffect, useRef} from 'react';
import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useTokenStore} from './store/store';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {isAuthenticated} = useTokenStore();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({top: 0, behavior: 'auto'});
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/?redirect=${encodeURIComponent(location.pathname)}`, {replace: true});
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    isAuthenticated && (
      <div className="flex h-screen">
        <TopBar />
        <SideBar />
        <div ref={containerRef} className="flex-1 overflow-auto ml-52 mt-14" id="scroll-container">
          <Outlet />
        </div>
      </div>
    )
  );
}
