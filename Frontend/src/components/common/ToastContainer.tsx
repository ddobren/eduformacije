import { AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import { ToastMessage } from './ToastMessage';

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed z-50 flex flex-col gap-2 pointer-events-none">
      <div className="fixed bottom-0 right-0 left-0 sm:left-auto flex flex-col-reverse gap-2 max-h-screen overflow-hidden p-4 sm:p-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto mx-auto sm:mx-0 w-full max-w-[calc(100vw-32px)] sm:max-w-[420px] md:max-w-[448px] lg:max-w-[480px]">
              <ToastMessage {...toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
