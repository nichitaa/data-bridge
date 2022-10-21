export const TOAST_VARIANT = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
} as const;
export type ToastVariant = typeof TOAST_VARIANT[keyof typeof TOAST_VARIANT];
export type ToastVariantProps<T> = Partial<Record<ToastVariant, T>>;
