import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import InitialLayout from './InitialLayout';

export default function LandingContainer() {
  return (
    <InitialLayout>
      {/* 우측 */}
      <motion.div
        className="absolute right-0 top-0 flex flex-col min-h-screen justify-center items-start gap-16 pl-40"
        style={{width: 'calc(100% - 800px)'}}
        initial={{opacity: 0, x: 100}}
        animate={{opacity: 1, x: 0}}
        transition={{type: 'tween', duration: 0.5, ease: 'easeInOut'}}
      >
        <p className="text-black text-4xl font-bold">WELCOME</p>
        <div className="flex flex-col gap-6 w-80">
          <Link to="/signin" className="main-btn-lg text-left">
            회원 로그인
          </Link>
          <Link to="/signup" className="main-btn-lg text-left">
            계정 등록 신청
          </Link>
          <Link to="/resetpwd" className="main-btn-lg text-left">
            비밀번호 재설정
          </Link>
        </div>
      </motion.div>
    </InitialLayout>
  );
}
