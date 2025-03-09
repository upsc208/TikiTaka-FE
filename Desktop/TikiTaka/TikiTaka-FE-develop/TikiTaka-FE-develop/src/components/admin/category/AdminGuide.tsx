import { Info, Layers } from "lucide-react";

export default function AdminGuide() {
  return (
    <div className="w-[470px] flex-shrink-0 self-start ">
      <div className="flex justify-center mb-4">
        <Layers size={40} className="text-main" />
      </div>

      <h2 className="text-title-bold text-gray-800 text-center mb-5">
        카테고리 관리 가이드
      </h2>

      <p className="text-sm text-gray-600 text-center leading-6 mb-6">
        카테고리는 1차 & 2차로 구분됩니다. 1차 카테고리를 생성한 후, 해당 그룹에 2차 카테고리를 추가할 수 있습니다.
      </p>

      <div className="bg-gray-18 p-3 rounded-md shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Info size={16} className="text-blue-500" />
          <span>1차 카테고리는 개별 그룹을 의미합니다.</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Info size={16} className="text-blue-500" />
          <span>2차 카테고리는 세부 항목을 포함합니다.</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Info size={16} className="text-blue-500" />
          <span>2차 카테고리에서 요청 양식을 등록할 수 있습니다.</span>
        </div>
      </div>

      
    </div>
  );
}
