import { useLocation } from 'react-router-dom';
import SignInContainer from '../../../components/common/siginin/SignInContainer';
import { useEffect } from 'react';

export default function SignIn() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.alertMessage) {
      alert(location.state.alertMessage);
    }
  }, [location.state]);
  return <SignInContainer />;
}
