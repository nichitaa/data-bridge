import { generateUtilityClasses } from '@mui/material';

export const toastStyles = {
  minHeight: '40px',
  minWidth: '286px',
} as const;

// toast class names

export const toastClasses = generateUtilityClasses('AppToast', [
  // react-toastify
  'container',
  'toast',
  'body',
  'progressBar',
  // custom
  'content',
  'text',
]);
