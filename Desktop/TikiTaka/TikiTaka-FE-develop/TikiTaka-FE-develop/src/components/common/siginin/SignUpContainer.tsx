import {useEffect, useState} from 'react';
import DOMPurify from 'dompurify';
import InitialTopBar from './InitialTopBar';
import {SmRightIcon, ValidateIcon, WhiteCheckIcon} from '../Icon';
import Modal from '../Modal';
import {validateEmail, validateId} from '../../../utils/Validation';
import {Link, useNavigate} from 'react-router-dom';
import {postRegistration} from '../../../api/service/registration';
import {termsContent} from '../../../constants/terms';
import {useTokenStore} from '../../../store/store';
import {useEnterKeyHandler} from '../../../hooks/useEnterKeyHandler';

export default function SignUpContainer() {
  const navigate = useNavigate();
  const {isAuthenticated} = useTokenStore();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [id, setId] = useState('');
  const [idError, setIdError] = useState('');

  const [checked, setChecked] = useState(false);
  const [termsError, setTermsError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('계정 등록 안내');
  const [modalMessage, setModalMessage] = useState('');

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value ? (validateEmail(value) ? '' : '잘못된 이메일 주소입니다.') : '이메일을 입력해주세요.');
  };

  const idChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setId(value);
    setIdError(value ? (validateId(value) ? '' : '아이디는 영어 소문자와 점(.)을 포함한 3~15자여야 합니다.') : '아이디를 입력해주세요.');
  };

  const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setTermsError(e.target.checked ? '' : '이용 정보에 동의해 주세요.');
  };

  const onClickSubmit = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    if (!checked) {
      setTermsError('이용 정보에 동의해 주세요.');
      return;
    }
    setTermsError('');

    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedId = DOMPurify.sanitize(id);

    try {
      const response = await postRegistration({email: sanitizedEmail, username: sanitizedId});
      setModalTitle(response.status === 200 ? '계정 등록 신청' : '계정 등록 실패');
      setModalMessage(
        response.status === 200
          ? '등록 신청이 완료되었습니다. 결과는 카카오워크로 안내드릴 예정입니다.'
          : '계정 등록 중 오류가 발생했습니다.'
      );
    } catch (error: any) {
      setModalTitle('계정 등록 실패');
      setModalMessage(error.response?.data?.message || '알 수 없는 오류가 발생했습니다.');
    }
    setIsModalOpen(true);
  };

  useEnterKeyHandler(onClickSubmit);

  const closeModal = () => {
    setEmail('');
    setId('');
    setChecked(false);
    setEmailError('');
    setIdError('');
    setTermsError('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      alert('이미 계정에 로그인되어 있습니다. 다른 작업을 진행해주세요.');
      navigate(-1);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <InitialTopBar />
      <div className="top-container items-center">
        <div className="flex flex-col items-center gap-10 w-[400px]">
          <p className="text-black text-2xl font-bold">계정 등록 신청</p>
          <p className="text-gray-5 text-sm font-bold text-center">
            카카오워크로 계정 등록 알림을 보내드립니다. <br />
            카카오워크에 가입한 이메일 주소를 입력해 주세요.
          </p>
          <div className="flex w-full flex-col gap-5">
            <div className="email">
              <input
                id="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={emailChange}
                placeholder="[Email] &nbsp; user@tikitaka.com"
                required
                className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${emailError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
              />
              <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${emailError ? '' : 'hidden'}`}>
                <ValidateIcon />
                {emailError}
              </div>
            </div>
            <div className="id">
              <input
                id="id"
                autoComplete="id"
                type="id"
                value={id}
                onChange={idChange}
                placeholder="[ID] &nbsp; 3~15자리/영문 소문자, 점(.) 조합"
                required
                className={`py-3 px-4 text-subtitle-regular w-full border rounded-md focus:outline-none 
                ${idError ? 'border-error' : 'border-gray-2 focus:border-main'}`}
              />
              <div className={`flex relative text-error text-xs mt-1 items-center gap-1 ${idError ? '' : 'hidden'}`}>
                <ValidateIcon />
                {idError}
              </div>
            </div>
            <div className="accountTerms">
              <div className="flex w-full py-2 items-center justify-between ">
                <div className="flex items-center gap-[26px]">
                  <p className="text-sm font-bold">이용 정보 동의</p>
                  <label
                    className={`flex items-center justify-center w-4 h-4 border border-gray-2 rounded-md cursor-pointer 
                    ${checked ? 'bg-main border-main' : 'hover:border-main'}`}
                  >
                    <input type="checkbox" checked={checked} onChange={checkboxChange} className="hidden" />
                    {checked && <WhiteCheckIcon />}
                  </label>
                </div>

                <div
                  className="flex px-2 text-xs text-gray-6 gap-2 focus:outline-none hover:text-main cursor-pointer"
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  이용 정보 자세히 보기
                  <SmRightIcon strokeColor="#727586" />
                </div>
              </div>
              <div className={`flex relative text-error text-xs mt-1 ${termsError ? '' : 'hidden'}`}>{termsError}</div>
            </div>
          </div>
          <button onClick={onClickSubmit} className="main-btn-lg w-full">
            신청 완료
          </button>
          <div className="flex justify-end w-full pr-4">
            <Link to="/" className="text-sm text-gray-2 cursor-pointer hover:underline hover:text-gray-15">
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
      {isModalOpen && <Modal title={modalTitle} content={modalMessage} backBtn="확인" onBackBtnClick={closeModal} />}
      {isTermsModalOpen && (
        <Modal title="이용약관" content={termsContent} backBtn="닫기" onBackBtnClick={() => setIsTermsModalOpen(false)} />
      )}
    </div>
  );
}
