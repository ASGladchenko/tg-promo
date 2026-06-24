import {
  toast,
  type Id,
  type ToastContent,
  type ToastOptions,
  type ToastPosition,
  type TypeOptions
} from "react-toastify";

type Notify = {
  <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>): Id;
  error: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
  info: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
  success: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
  warning: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
};

export type ToastId = Id;
export type AppToastContent<TData = unknown> = ToastContent<TData>;
export type AppToastOptions<TData = unknown> = ToastOptions<TData>;
export type AppToastPosition = ToastPosition;
export type AppToastType = TypeOptions;

export const notify: Notify = Object.assign(
  <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => toast(content, options),
  {
    error: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) =>
      toast.error(content, options),
    info: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) =>
      toast.info(content, options),
    success: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) =>
      toast.success(content, options),
    warning: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) =>
      toast.warning(content, options)
  }
);

export function dismissToast(toastId?: ToastId): void {
  toast.dismiss(toastId);
}
