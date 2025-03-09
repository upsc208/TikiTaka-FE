import {useQuery} from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import {getRegistrationList} from '../../../api/service/registration';
import Dropdown from '../../common/Dropdown';
import PageNations from '../../common/PageNations';
import AccountCard from './AccountCard';
import {ACCOUNT_MENU} from '../../../constants/constants';

interface RegistrationAccount {
  registrationId: number;
  username: string;
  email: string;
  status: 'PENDING' | 'REJECTED';
  createdAt: string;
}

export default function AccountList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'REJECTED'>('PENDING');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [currentPage]);

  const {data} = useQuery({
    queryKey: ['registrationAccounts', selectedStatus, currentPage],
    queryFn: () => getRegistrationList({page: currentPage - 1, size: itemsPerPage, status: selectedStatus}),
  });

  const accounts: RegistrationAccount[] = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalElements = data?.data?.totalElements ?? 0;

  const sortedAccounts = accounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value === '승인 대기' ? 'PENDING' : 'REJECTED');
  };

  return (
    <div className="w-full mt-[20px] relative mb-[100px]" ref={containerRef}>
      <div className="bg-gray-18 h-full flex flex-col justify-start p-4">
        {/* 필터 */}
        <div className="flex items-center justify-between px-2">
          <Dropdown
            label={selectedStatus === 'PENDING' ? '승인 대기' : '거절됨'}
            options={['승인 대기', '거절됨']}
            onSelect={handleStatusSelect}
            paddingX="px-2"
          />
          <div className="ml-auto text-gray-700 text-subtitle">
            조회 건수 <span className="text-black text-title-bold ml-1">{totalElements}건</span>
          </div>
        </div>

        <div className="flex gap-4 py-2 text-gray-700 text-title-regular mt-5 mb-5 px-4">
          <div className="w-[12%]">{ACCOUNT_MENU[0]}</div>
          <div className="w-[16%]">{ACCOUNT_MENU[1]}</div>
          <div className="w-[44%]">{ACCOUNT_MENU[2]}</div>
          <div className="w-[16%]">{ACCOUNT_MENU[3]}</div>
          <div className="w-[20%]">{ACCOUNT_MENU[4]}</div>
        </div>

         {sortedAccounts.length === 0 ? (
          <div className="text-gray-500 text-center py-10">등록된 계정 신청이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedAccounts.map((account) => (
              <AccountCard key={account.registrationId} {...account} role="USER" />
            ))}
          </div>
        )}

        {sortedAccounts.length > 0 && (
          <PageNations currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
