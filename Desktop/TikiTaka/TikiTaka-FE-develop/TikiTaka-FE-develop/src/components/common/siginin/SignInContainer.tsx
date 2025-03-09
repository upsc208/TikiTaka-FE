import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import DOMPurify from 'dompurify';
import {useTokenStore, useUserStore} from '../../../store/store';
import {validateId, validatePwd} from '../../../utils/Validation';
import InitialLayout from './InitialLayout';
import {postLogin} from '../../../api/service/auth';
import Modal from '../Modal';
import {useEnterKeyHandler} from '../../../hooks/useEnterKeyHandler';
import {EyeIcon, EyeOffIcon, ValidateIcon} from '../Icon';

export default function SignInContainer() {
  const navigate = useNavigate();
  const {isAuthenticated, login} = useTokenStore();
  const {setUserId, setRole} = useUserStore();

  const [id, setId] = useState('');
  const [idError, setIdError] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('로그인');
  const [modalMessage, setModalMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect');

  const validateInput = (type: 'id' | 'pwd', value: string) => {
    if (!value) return type === 'id' ? '아이디를 입력해주세요.' : '비밀번호를 입력해주세요.';
    if (type === 'id' && !validateId(value)) return '아이디는 영어 소문자와 점(.)을 포함한 3~15자여야 합니다.';
    if (type === 'pwd' && !validatePwd(value)) return '비밀번호는 영문, 숫자, 특수문자가 조합된 8~32자여야 합니다.';
    return '';
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>, type: 'id' | 'pwd') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      setError(validateInput(type, value));
    };

  const onClickLogin = async () => {
    const idValidation = validateInput('id', id);
    const pwdValidation = validateInput('pwd', pwd);

    setIdError(idValidation);
    setPwdError(pwdValidation);

    if (idValidation || pwdValidation) return;

    const sanitizedId = DOMPurify.sanitize(id);
    const sanitizedPwd = DOMPurify.sanitize(pwd);

    try {
      const response = await postLogin({username: sanitizedId, password: sanitizedPwd});
      if (!response) {
        setModalMessage('');
        setModalTitle('');
      }

      if (response) {
        const {accessToken, data} = response;
        if (accessToken) {
          login(accessToken);
          if (data.role && data.id) {
            setRole(data.role);
            setUserId(data.id);
          }
          if (data.passwordChangeNeeded) {
            setModalTitle('비밀번호 변경 안내');
            setModalMessage('비밀번호 변경이 필요합니다. 지금 변경하시겠습니까?');
            setIsModalOpen(true);
            return;
          } else {
            navigate(redirectTo || `/${data.role.toLowerCase()}`, {replace: true});
          }
        }
      }
    } catch (error: any) {
      setIsModalOpen(true);
      setModalTitle('로그인 안내');
      setModalMessage(error.response?.data?.message || '다시 시도해주세요.');
    }
  };
  useEnterKeyHandler(onClickLogin);

  const handleSkipPasswordChange = () => {
    setIsModalOpen(false);
    navigate(redirectTo || `/${useUserStore.getState().role.toLowerCase()}`, {replace: true});
  };

  const handleChangePasswordNow = () => {
    setIsModalOpen(false);
    navigate(`/${useUserStore.getState().role.toLowerCase()}/pwdchange`, {replace: true});
  };

  const closeModal = () => {
    setId('');
    setIdError('');
    setPwd('');
    setPwdError('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      alert('이미 계정에 로그인되어 있습니다. 다른 작업을 진행해주세요.');
      navigate(-1);
    }
  }, []);

  return (
    <InitialLayout>
      <div className="w-full absolute right-0 top-0 min-h-screen flex items-center justify-center">
        <div className="flex flex-col justify-center items-start gap-10 w-[400px]">
          <p className="w-full text-center text-black text-2xl font-bold">로그인</p>
          <div className="flex flex-col w-full gap-5">
            {/* 아이디 */}
            <div className="id">
              <input
                id="id"
                autoComplete="id"
                type="text"
                value={id}
                onChange={handleChange(setId, setIdError, 'id')}
                placeholder="아이디를 입력하세요"
                required
                className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${idError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
              />
              <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${idError ? '' : 'hidden'}`}>
                <ValidateIcon />
                {idError}
              </div>
            </div>
            {/* 비밀번호 */}
            <div className="password">
              <div className="relative w-full">
                <input
                  id="password"
                  autoComplete="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={pwd}
                  onChange={handleChange(setPwd, setPwdError, 'pwd')}
                  placeholder="비밀번호를 입력하세요"
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
          </div>
          {/* 버튼 */}
          <button onClick={onClickLogin} className=" w-full main-btn-lg">
            로그인
          </button>
          <div className="flex justify-end w-full pr-4">
            <Link to="/signup" className="text-sm text-gray-2 cursor-pointer hover:underline hover:text-gray-15">
              계정 등록 신청
            </Link>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          title={modalTitle}
          content={modalMessage}
          warningContent={
            modalTitle.includes('비밀번호 변경') ? `임시 비밀번호 유출 방지를 위해\n최초 로그인 시 반드시 비밀번호를 변경해 주세요.` : ''
          }
          backBtn={modalTitle.includes('비밀번호 변경') ? '다음에 변경' : '확인'}
          onBackBtnClick={modalTitle.includes('비밀번호 변경') ? handleSkipPasswordChange : closeModal}
          checkBtn={modalTitle.includes('비밀번호 변경') ? '비밀번호 변경' : undefined}
          onBtnClick={modalTitle.includes('비밀번호 변경') ? handleChangePasswordNow : undefined}
        />
      )}
    </InitialLayout>
  );
}
