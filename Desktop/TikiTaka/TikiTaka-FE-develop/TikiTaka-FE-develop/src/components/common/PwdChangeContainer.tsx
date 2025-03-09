import {Link, useNavigate} from 'react-router-dom';
import DOMPurify from 'dompurify';
import {useUserStore} from '../../store/store';
import {useState} from 'react';
import {validatePwd} from '../../utils/Validation';
import Modal from './Modal';
import {patchUserPassword} from '../../api/service/users';
import {EyeIcon, EyeOffIcon, ValidateIcon} from './Icon';
import TopMenu from './TopMenu';
import {useEnterKeyHandler} from '../../hooks/useEnterKeyHandler';

export default function PwdChangeContainer() {
  const {role, userId} = useUserStore();
  const navigate = useNavigate();

  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdError, setNewPwdError] = useState('');
  const [newPwdCheck, setNewPwdCheck] = useState('');
  const [newPwdCheckError, setNewPwdCheckError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisibleNew, setIsPasswordVisibleNew] = useState(false);
  const [isPasswordVisibleCheck, setIsPasswordVisibleCheck] = useState(false);

  const [modalState, setModalState] = useState<{open: boolean; type: 'error' | 'success' | null; message: string}>({
    open: false,
    type: null,
    message: '',
  });

  const pwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPwd(value);

    if (value === '') {
      setPwdError('비밀번호를 입력해주세요.');
    } else if (!validatePwd(value)) {
      setPwdError('비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.');
    } else {
      setPwdError('');
    }
  };

  const newPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPwd(value);

    if (value === '') {
      setNewPwdError('비밀번호를 입력해주세요.');
    } else if (!validatePwd(value)) {
      setNewPwdError('비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.');
    } else {
      setNewPwdError('');
    }
  };

  const newPwdCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPwdCheck(value);

    if (value === '') {
      setNewPwdCheckError('비밀번호를 입력해주세요.');
    } else if (!validatePwd(value)) {
      setNewPwdCheckError('비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.');
    } else if (value !== newPwd) {
      setNewPwdCheckError('비밀번호가 일치하지 않습니다.');
    } else {
      setNewPwdCheckError('');
    }
  };

  const onClickChange = async () => {
    if (pwd === '') {
      setPwdError('비밀번호를 입력해주세요.');
      return;
    } else if (!validatePwd(pwd)) {
      setPwdError('비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.');
      return;
    }

    if (newPwd === '') {
      setNewPwdError('새 비밀번호를 입력해주세요.');
      return;
    } else if (!validatePwd(newPwd)) {
      setNewPwdError('새 비밀번호는 영문, 숫자, 특수문자가 조합된 6~32자여야 합니다.');
      return;
    }

    if (newPwdCheck === '') {
      setNewPwdCheckError('새 비밀번호를 다시 입력해주세요.');
      return;
    } else if (newPwd !== newPwdCheck) {
      setNewPwdCheckError('비밀번호가 일치하지 않습니다.');
      return;
    } else if (!validatePwd(newPwdCheck)) {
      setPwdError('비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.');
      return;
    }

    const sanitizedPwd = DOMPurify.sanitize(pwd);
    const sanitizedNewPwd = DOMPurify.sanitize(newPwd);

    const requestData = {
      currentPassword: sanitizedPwd,
      newPassword: sanitizedNewPwd,
    };

    try {
      await patchUserPassword(requestData, userId);
      setModalState({open: true, type: 'success', message: '비밀번호가 성공적으로 변경되었습니다.'});
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';

      setModalState({open: true, type: 'error', message: errorMessage});
    }
  };

  useEnterKeyHandler(onClickChange);

  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200">
        <TopMenu boldBlackText="비밀번호 변경" />
        <div className="flex flex-col mt-32 items-center gap-5">
          <p className="text-error text-sm font-bold text-center">
            임시 비밀번호 유출 방지를 위해 <br /> 최초 로그인 시 반드시 비밀번호를 변경해 주세요.
          </p>
          <div className="flex flex-col items-center gap-10 w-[400px]">
            <div className="flex flex-col w-full gap-5">
              {/* 현재 비밀번호 */}
              <div className="currentPwd">
                <div className="relative w-full">
                  <input
                    id="currentPwd"
                    autoComplete="currentPwd"
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={pwd}
                    onChange={pwdChange}
                    placeholder="현재 비밀번호를 입력하세요"
                    required
                    className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${pwdError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${pwdError ? '' : 'hidden'}`}>
                  <ValidateIcon />
                  {pwdError}
                </div>
              </div>
              {/* 새 비밀번호 */}
              <div className="newPwd">
                <div className="relative w-full">
                  <input
                    id="newPwd"
                    autoComplete="newPwd"
                    type={isPasswordVisibleNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={newPwdChange}
                    placeholder="새 비밀번호를 입력하세요"
                    required
                    className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${newPwdError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsPasswordVisibleNew(!isPasswordVisibleNew)}
                  >
                    {isPasswordVisibleNew ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${newPwdError ? '' : 'hidden'}`}>
                  <ValidateIcon />
                  {newPwdError}
                </div>
              </div>
              {/* 새 비밀번호 확인*/}
              <div className="newPwdCheck">
                <div className="relative w-full">
                  <input
                    id="newPwdCheck"
                    autoComplete="newPwdCheck"
                    type={isPasswordVisibleCheck ? 'text' : 'password'}
                    value={newPwdCheck}
                    onChange={newPwdCheckChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                    className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${newPwdCheckError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsPasswordVisibleCheck(!isPasswordVisibleCheck)}
                  >
                    {isPasswordVisibleCheck ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${newPwdCheckError ? '' : 'hidden'}`}>
                  <ValidateIcon />
                  {newPwdCheckError}
                </div>
              </div>
            </div>
            {/* 버튼 */}
            <button onClick={onClickChange} className="main-btn-lg w-full">
              변경 완료
            </button>
            <div className="flex justify-end w-full">
              <Link to={`/${role.toLowerCase()}`} className="text-sm text-gray-2 cursor-pointer hover:underline hover:text-gray-15">
                다음에 변경하기
              </Link>
            </div>
          </div>
          {modalState.open && (
            <Modal
              title={modalState.type === 'error' ? '비밀번호 오류' : '변경 완료'}
              content={modalState.message}
              backBtn="확인"
              onBackBtnClick={() => {
                setModalState({open: false, type: null, message: ''});
                if (modalState.type === 'success') {
                  navigate(role.toLowerCase() === 'admin' ? '/admin/accounts' : `/${role.toLowerCase()}`, {replace: true});
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
