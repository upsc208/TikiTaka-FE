interface ManagerItemProps {
  name: string;
  email: string;
  profile?: string;
  totalTickets: number;
}

export default function ManagerItem({name, email, profile, totalTickets}: ManagerItemProps) {
  return (
    <div className="bg-main text-white flex flex-col items-center py-4 px-3 rounded">
      <img
        src={profile ? profile : '/assets/profile.png'}
        alt="프로필 이미지"
        className="w-[76px] h-[76px] rounded-full mb-2  object-cover"
      />
      <h1 className="text-subtitle mt-2">{name}</h1>
      <p className="text-caption-regular">{email}</p>

      <div className="mt-[30px]">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col text-body-regular space-y-2">
            <p>
              전체<span className="text-caption-regular">(건)</span>
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center text-caption-bold text-main bg-white rounded-full px-3 py-1">
              {totalTickets}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
