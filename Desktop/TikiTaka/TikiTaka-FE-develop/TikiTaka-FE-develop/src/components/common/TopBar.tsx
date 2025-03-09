import {useState} from 'react';
import {useTokenStore, useUserStore} from '../../store/store';
import {DownIcon, LogoIcon} from './Icon';
import {Link, useNavigate} from 'react-router-dom';
import {postLogout} from '../../api/service/auth';
import Profile from './Profile';
import {useOutsideClick} from '../../hooks/useOutsideClick';

export default function TopBar() {
  const {role, userId} = useUserStore();
  const {logout} = useTokenStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roleLabel = {manager: 'MANAGER', admin: 'ADMIN', user: 'USER'}[role?.toLowerCase()] || '';
  const dropRef = useOutsideClick(() => setIsDropdownOpen(false));

  const onClickLogout = () => {
    try {
      postLogout();
      logout();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="bg-main fixed w-full h-14 z-[50]">
      <div className="relative w-full h-14 shrink-0 flex justify-between pl-12 pr-24 py-4">
        <Link to={`/${role.toLowerCase()}`} className="flex items-center gap-2">
          <LogoIcon />
          <div className="flex gap-3 items-center">
            <div className="flex items-center text-white font-bold text-lg ">TIKITAKA</div>
            <div className="h-full text-caption-regular px-2 py-0.5 border border-gray-2 rounded-md text-gray-2">{roleLabel}</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="">
            <Profile userId={userId} size="md" isTopBar />
          </div>
          <div className="relative flex items-center text-white cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <DownIcon />
            </div>
            {isDropdownOpen && (
              <div
                className="absolute top-10 bg-white border border-gray-3 rounded-md shadow-lg z-[999] left-1/2 transform -translate-x-1/2"
                ref={dropRef}
              >
                <ul>
                  <li
                    className="px-2 py-1.5 text-center cursor-pointer leading-none m-2 text-black text-caption-regular hover:bg-gray-1 hover:font-bold rounded-md whitespace-nowrap"
                    onClick={() => navigate(`/${role?.toLowerCase()}/pwdchange`)}
                  >
                    비밀번호 변경
                  </li>
                  <li
                    className="px-2 py-1.5 text-center cursor-pointer leading-none m-2 text-black text-caption-regular hover:bg-gray-1 hover:font-bold rounded-md"
                    onClick={onClickLogout}
                  >
                    로그아웃
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
