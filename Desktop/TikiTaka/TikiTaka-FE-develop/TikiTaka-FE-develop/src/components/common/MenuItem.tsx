import React, {useEffect, useState} from 'react';
import {SmRightIcon} from './Icon';
import {Link, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';

interface MenuItemProps {
  icon: React.ComponentType<{strokeColor: string}>;
  text: string;
  to: string;
  children?: React.ReactNode;
}

// 사이드바 내부 메뉴 컴포넌트
export default function MenuItem({icon: Icon, text, to, children}: MenuItemProps) {
  const location = useLocation();
  const subPaths = React.Children.map(children, (child) => (React.isValidElement<{to: string}>(child) ? child.props.to : null)) || [];

  const isActive = [to, ...subPaths].includes(location.pathname);

  const [isExpanded, setIsExpanded] = useState(isActive || !!children);

  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
    }
  }, [isActive]);

  const handleToggle = (e: React.MouseEvent) => {
    if (children) {
      // e.preventDefault();
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (!isActive) setIsExpanded(false);
      }}
    >
      <Link
        to={to}
        onClick={handleToggle}
        className={`side-menu rounded-lg border border-gray-18 ${
          isActive ? 'active-menu text-subtitle text-gray-15 ' : 'gray-hover text-subtitle-regular text-gray-8'
        }`}
      >
        <div className="flex items-center gap-4 ">
          <Icon strokeColor={isActive ? '#1A1B1F' : '#565965'} />
          {text}
        </div>
        <SmRightIcon strokeColor={isActive ? '#1A1B1F' : '#A3A8BF'} />
      </Link>
      {/* 하위 메뉴 */}
      {children && isExpanded && (
        <motion.div
          className="ml-12 flex flex-col gap-2"
          initial={{opacity: 0, y: -5}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -5}}
          transition={{type: 'spring', stiffness: 300, damping: 30}}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
