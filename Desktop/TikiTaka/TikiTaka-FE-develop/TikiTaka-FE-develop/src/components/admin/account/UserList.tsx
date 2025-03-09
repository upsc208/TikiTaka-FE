import {useQuery} from '@tanstack/react-query';
import {getUserList} from '../../../api/service/users';
import UserCard from './UserCard';
import {ACCOUNT_MENU} from '../../../constants/constants';

interface UserAccount {
  userId: number;
  username: string;
  email: string;
  role: string;
  profileImageUrl?: string;
}

export default function UserList() {
  const {data} = useQuery<UserListResponse>({
    queryKey: ['userAccounts'],
    queryFn: getUserList,
  });

  const accounts: UserAccount[] = data?.users ?? [];

  return (
    <div className="w-full mt-[20px] relative mb-[100px]">
      <div className="bg-gray-18 h-full flex flex-col justify-start p-4">
        {/* 조회 건수 */}
        <div className="flex items-center justify-between px-2">
          <div className="text-[14px]">시스템 사용자 목록 조회</div>
          <div className="ml-auto text-gray-700 text-subtitle text-right mt-2 mb-3 gap-4">
            <span className="mr-4">
              관리자<span className="text-black text-title-bold ml-2">{data?.adminCount ?? 0}명</span>
            </span>
            <span className="mr-4">
              담당자 <span className="text-black text-title-bold ml-2">{data?.managerCount ?? 0}명</span>
            </span>
            <span>
              사용자 <span className="text-black text-title-bold ml-2">{data?.userCount ?? 0}명</span>
            </span>
          </div>
        </div>

        <div className="flex gap-4 py-2 text-gray-700 text-title-regular mt-5 mb-5 px-4">
          <div className="w-[12%]">{ACCOUNT_MENU[0]}</div>
          <div className="w-[16%]">{ACCOUNT_MENU[1]}</div>
          <div className="w-[44%]">{ACCOUNT_MENU[2]}</div>
          <div className="w-[16%]">{ACCOUNT_MENU[3]}</div>
          <div className="w-[20%]">{ACCOUNT_MENU[4]}</div>
        </div>

        <div className="flex flex-col gap-4">
          {accounts.map((account) => (
            <UserCard key={account.userId} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
}
