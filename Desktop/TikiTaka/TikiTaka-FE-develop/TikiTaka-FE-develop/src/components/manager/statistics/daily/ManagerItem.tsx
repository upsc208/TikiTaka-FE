interface ManagerItemProps {
  name: string;
  email: string;
  processing: number;
  completed: number;
  profile: string;
}

export default function ManagerItem({name, email, processing, completed, profile}: ManagerItemProps) {
  return (
    <div className="h-full bg-main text-white flex flex-col items-center py-4 px-3 rounded-md">
      <img
        src={profile ? profile : '/assets/profile.png'}
        alt="프로필 이미지"
        className="w-[76px] h-[76px] rounded-full mb-2 object-cover"
      />
      <h1 className="text-subtitle mt-2">{name}</h1>
      <p className="text-caption-regular">{email}</p>

      <div className="mt-[30px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-body-regular space-y-2">
            <p>처리 중</p>
            <p>처리 완료</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center text-caption-bold text-main bg-white rounded-full px-3 py-1">{processing}</div>
            <div className="flex items-center justify-center text-caption-bold text-main bg-white rounded-full px-3 py-1">{completed}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
