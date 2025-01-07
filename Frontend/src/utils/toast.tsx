import { useToast } from "../hooks/useToast";

export const toast = {
  success: (title: string, message?: string) => {
    useToast.getState().addToast({ type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    useToast.getState().addToast({ type: 'error', title, message });
  },
  warning: (title: string, message?: string) => {
    useToast.getState().addToast({ type: 'warning', title, message });
  },
  info: (title: string, message?: string) => {
    useToast.getState().addToast({ type: 'info', title, message });
  },
};
