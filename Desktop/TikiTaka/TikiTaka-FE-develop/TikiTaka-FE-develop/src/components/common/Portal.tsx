import {ReactNode} from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

function Portal({children}: PortalProps) {
  const portalRoot = document.getElementById('portal-root');
  return portalRoot ? ReactDOM.createPortal(children, portalRoot) : null;
}

export default Portal;
