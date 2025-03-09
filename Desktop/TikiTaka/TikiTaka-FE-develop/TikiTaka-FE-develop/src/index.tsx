import App from './App';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  </QueryClientProvider>
);
