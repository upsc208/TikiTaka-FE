import {useEffect, useRef, useState} from 'react';
import {useUserStore} from '../../store/store';
import {getUserInfo, patchUserProfileImage} from '../../api/service/users';
import {CameraIcon} from './Icon';
import {useQuery, useQueryClient} from '@tanstack/react-query';

export default function UserBox() {
  const {userId, setUserId, setRole, setUserName} = useUserStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {data: userInfo} = useQuery<UserDetailResponse>({
    queryKey: ['userInfo', userId],
    queryFn: getUserInfo,
  });

  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.userId);
      setRole(userInfo.role);
      setUserName(userInfo.username);
      setLocalImageUrl(userInfo.profileImageUrl);
    }
  }, [userInfo]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    try {
      // 낙관적 업데이트
      const localUrl = URL.createObjectURL(file);
      setLocalImageUrl(localUrl);

      const uploadResponse = await patchUserProfileImage(userId, file);
      if (!uploadResponse) throw new Error('File upload failed');

      // 쿼리 무효화
      queryClient.invalidateQueries({queryKey: ['userInfo', userId]});
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      // 업로드 실패 시 로컬 이미지 URL 초기화
      setLocalImageUrl(null);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  if (!userInfo) return null;
  return (
    <div className="flex flex-col w-full h-32 border-b border-gray-2 p-2 pb-4 justify-center gap-1">
      <div className="relative w-12 h-12 rounded-full my-2">
        <img
          src={localImageUrl || userInfo.profileImageUrl || '/assets/profile.png'}
          alt="프로필 이미지"
          className="w-full h-full object-cover rounded-full"
        />
        <div className="absolute bottom-0 right-0 cursor-pointer" onClick={handleCameraClick}>
          <CameraIcon />
        </div>
      </div>
      <div className="text-main text-subtitle">{userInfo.username}</div>
      <div className="text-gray-6 text-xs">{userInfo.email}</div>
      <input ref={fileInputRef} type="file" accept="image/png, image/jpeg" style={{display: 'none'}} onChange={handleImageUpload} />
    </div>
  );
}
