import {useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {patchDeleteUser, patchUserRole} from '../../../api/service/users';
import Modal from '../../common/Modal';
import RoleDropdown from './RoleDropdown';
import {DotIcon} from '../../common/Icon';
import {toast} from 'react-toastify';

interface UserCardProps {
    userId: number; 
    username: string;
    email: string;
    role: string;
  }

const roleApiToDisplay: Record<string, string> = {
    ADMIN: "관리자",
    MANAGER: "담당자",
    USER: "사용자",
  };
  
  const roleDisplayToApi: Record<string, "ADMIN" | "MANAGER" | "USER"> = {
    관리자: "ADMIN",
    담당자: "MANAGER",
    사용자: "USER",
  };

export default function AccountCard({ userId, username, email, role }: UserCardProps) {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(roleApiToDisplay[role] || "사용자"); 

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => patchDeleteUser(userId), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAccounts"] }); 
      toast.success("계정이 삭제되었습니다.");
      setShowDeleteModal(false);
    },
    onError: () => {
      toast.error("계정 삭제에 실패했습니다.");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: () =>
      patchUserRole(userId, {
        role: roleDisplayToApi[selectedRole], 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAccounts"] });
      toast.success(`역할이 ${selectedRole}로 변경되었습니다.`);
    },
    onError: () => {
      toast.error("역할 변경에 실패했습니다.");
    },
  });

  return (
    <div className="flex gap-4 py-3 px-4 border border-gray-2 bg-white items-center rounded cursor-pointer text-subtitle-regular">
      <div className="w-[12%]">{userId}</div>
      <div className="w-[16%]">{username}</div>
      <div className="w-[44%]">{email}</div>
      <div className="w-[16%]">
        <RoleDropdown
          label={selectedRole}
          options={["관리자", "담당자", "사용자"]}
          onSelect={(value) => {
            setSelectedRole(value as "관리자" | "담당자" | "사용자");
            updateRoleMutation.mutate(); 
          }}
        />
      </div>
      <div className="w-[20%] flex gap-2">승인</div>
      <div className="absolute right-[40px] mt-1">
        <button type="button" onClick={() => setShowMenu(!showMenu)}>
          <DotIcon />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-1 w-[100px] bg-white shadow-md rounded border text-center">
            <button type="button" onClick={() => setShowDeleteModal(true)} className="w-full rounded py-2 text-[12px] font-semibold">
              <div className="hover:bg-gray-1 text-[12px] rounded-md mx-2 hover:border hover:border-gray-2 text-gray-15">계정 삭제</div>
            </button>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <Modal
          title="계정 삭제"
          content={`"${username}" 계정을 삭제하시겠습니까?`}
          backBtn="취소"
          onBackBtnClick={() => setShowDeleteModal(false)}
          checkBtn="삭제"
          onBtnClick={() => deleteMutation.mutate()}
        />
      )}
    </div>
  );
}
