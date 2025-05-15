import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaImages } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/10 text-white flex justify-around py-2">
      <Link to="/" className="flex flex-col items-center text-sm transition-opacity duration-200 hover:opacity-100" style={{ opacity: isActive('/') ? 1 : 0.6 }}>
        <FaHome className="text-xl" />
        Home
      </Link>
      <Link to="/tasks" className="flex flex-col items-center text-sm transition-opacity duration-200 hover:opacity-100" style={{ opacity: isActive('/tasks') ? 1 : 0.6 }}>
        <FaTasks className="text-xl" />
        Tasks
      </Link>
      <Link to="/collection" className="flex flex-col items-center text-sm transition-opacity duration-200 hover:opacity-100" style={{ opacity: isActive('/collection') ? 1 : 0.6 }}>
        <FaImages className="text-xl" />
        Collection
      </Link>
    </nav>
  );
};

export default Navbar;
