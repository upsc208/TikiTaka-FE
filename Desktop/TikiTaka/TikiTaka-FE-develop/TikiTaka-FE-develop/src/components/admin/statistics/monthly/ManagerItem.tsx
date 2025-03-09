interface ManagerItemProps {
  name: string;
  email: string;
  processing: number;
  completed: number;
}

export default function ManagerItem({name, email, processing, completed}: ManagerItemProps) {
  return (
    <div className="bg-main text-white flex flex-col items-center py-4 px-2 rounded">
      <img src="/assets/manager.png" alt="담당자 이미지" className="w-[76px] h-[76px]" />
      <h1 className="text-subtitle mt-2">{name}</h1>
      <p className="text-caption-regular">{email}</p>

      <div className="mt-[30px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-body-regular space-y-2">
            <p>
              전체<span className="text-caption-regular">(시간)</span>
            </p>
            <p>
              당월<span className="text-caption-regular">(시간)</span>
            </p>
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
