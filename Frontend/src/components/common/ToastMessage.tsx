import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export const ToastMessage: React.FC<ToastProps> = ({ id, type, title, message }) => {
  const { removeToast } = useToast();
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 5000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const getToastStyles = () => {
    const baseStyles = "flex items-start gap-3 rounded-lg p-4 shadow-lg backdrop-blur-sm w-full sm:w-[420px] md:w-[448px] lg:w-[480px]";
    const typeStyles = {
      success: "bg-green-500/10 border border-green-500/20 text-green-500",
      error: "bg-red-500/10 border border-red-500/20 text-red-500",
      warning: "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      info: "bg-primary-500/10 border border-primary-500/20 text-primary-400"
    };
    return `${baseStyles} ${typeStyles[type]}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={getToastStyles()}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        {message && (
          <p className="text-sm opacity-90 mt-1 line-clamp-2 break-words">
            {message}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
