import {Link, useLocation} from 'react-router-dom';

export default function SubMenuItem({to, text}: {to: string; text: string}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-xs text-gray-8 
        ${isActive ? 'text-gray-15 font-bold' : 'hover:text-gray-15'}`}
    >
      {text}
    </Link>
  );
}
