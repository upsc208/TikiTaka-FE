import {useEffect} from 'react';
import AdminGuide from './AdminGuide';
import CategoryList from './CategoryList';
import TopMenu from '../../common/TopMenu';

export default function AdminCategoryContainer() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200 justify-between">
        <TopMenu boldBlackText="카테고리 관리" boldSmText="카테고리 조회 · 등록 · 삭제 · 수정 " />
        <div className="flex">
          <div className="flex-1">
            <CategoryList />
          </div>
          <div className="w-[470px] flex-shrink-0 mt-[160px] mr-[30px]">
            <AdminGuide />
          </div>
        </div>
      </div>
    </div>
  );
}
