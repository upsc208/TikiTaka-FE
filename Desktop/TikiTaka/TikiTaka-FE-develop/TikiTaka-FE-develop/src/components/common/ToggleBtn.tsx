interface ToggleBtnProps {
  state: boolean;
  onClick: () => void;
}

export default function ToggleBtn({state, onClick}: ToggleBtnProps) {
  return (
    <div className="flex gap-4 items-center">
      <div
        onClick={onClick}
        className={`w-10 h-5 rounded-full flex items-center px-[3px] cursor-pointer ${
          state ? 'bg-green justify-end' : 'bg-disabled justify-start'
        }`}
      >
        <div className="w-[14px] h-[14px] rounded-full bg-white" />
      </div>
    </div>
  );
}
