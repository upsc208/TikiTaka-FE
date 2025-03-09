import {useState} from 'react';
import ProfilePopup from './ProfilePopup';
import {useQuery} from '@tanstack/react-query';
import {getUserDetail} from '../../api/service/users';
import {useOutsideClick} from '../../hooks/useOutsideClick';

interface ProfileInitialProps {
  userId?: number;
  size?: 'sm' | 'md' | 'lg';
  isTopBar?: boolean;
}

const sizeClasses = {sm: 'w-5 h-5 text-xs', md: 'w-6 h-6 text-sm', lg: 'w-8 h-8 text-base'};

export default function Profile({userId, size = 'sm', isTopBar}: ProfileInitialProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const popupRef = useOutsideClick(() => setIsPopupOpen(false));

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const {data: userDetail} = useQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => (userId ? getUserDetail(userId) : null),
    enabled: !!userId && userId !== -1, // userId가 존재할 때만 쿼리 실행
  });

  return (
    <div className="relative h-fit">
      {isPopupOpen && (
        <div className={`absolute top-full mt-4 mr-3 z-[999] ${isTopBar && 'left-1/2 transform -translate-x-1/2'}`} ref={popupRef}>
          {userDetail && <ProfilePopup userDetail={userDetail} />}
        </div>
      )}
      <div
        className={`${sizeClasses[size]} text-white rounded-full flex items-center justify-center  cursor-pointer overflow-hidden`}
        onClick={togglePopup}
      >
        {userDetail?.profileImageUrl ? (
          <img src={userDetail.profileImageUrl} alt="유저 프로필" className="w-full h-full object-cover" />
        ) : (
          <img src="/assets/profile.png" alt="프로필 기본 이미지" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
}
