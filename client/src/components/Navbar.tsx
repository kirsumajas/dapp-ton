import { NavLink } from 'react-router-dom';
import HomeIcon from './icons/Home';
import TasksIcon from './icons/Tasks';
import CollectionIcon from './icons/Collections';
import WalletIcon from './icons/Wallet';

interface Props {
  className?: string;
}

export default function NavBar({ className = '' }: Props) {
  const linkBase = 'flex flex-col items-center justify-center gap-2.5';
  const iconBase = 'w-6 h-6 transition-colors duration-200';

  const labelClass = (isActive: boolean) =>
    `text-sm ${isActive ? 'font-bold text-accent-g' : 'font-normal text-white'}`;

  return (
    <footer
      className={`w-full max-w-md mx-auto px-8 py-4 
                  pb-[calc(3rem+env(safe-area-inset-bottom))] 
                  min-h-[64px] bg-[#5555554c] backdrop-blur-[21px] 
                  backdrop-brightness-100 flex justify-between items-end shadow-lg ${className}`}
    >
      <NavLink to="/" end className={linkBase}>
        {({ isActive }) => (
          <>
            <HomeIcon className={`${iconBase} ${isActive ? 'text-accent-g' : 'text-white'}`} />
            <div className={labelClass(isActive)}>Home</div>
          </>
        )}
      </NavLink>

      <NavLink to="/tasks" className={linkBase}>
        {({ isActive }) => (
          <>
            <TasksIcon className={`${iconBase} ${isActive ? 'text-accent-g' : 'text-white'}`} />
            <div className={labelClass(isActive)}>Tasks</div>
          </>
        )}
      </NavLink>

      <NavLink to="/collection" className={linkBase}>
        {({ isActive }) => (
          <>
            <CollectionIcon className={`${iconBase} ${isActive ? 'text-accent-g' : 'text-white'}`} />
            <div className={labelClass(isActive)}>Collections</div>
          </>
        )}
      </NavLink>

      <NavLink to="/wallet" className={linkBase}>
        {({ isActive }) => (
          <>
            <WalletIcon className={`${iconBase} ${isActive ? 'text-accent-g' : 'text-white'}`} />
            <div className={labelClass(isActive)}>Wallet</div>
          </>
        )}
      </NavLink>
    </footer>
  );
}
