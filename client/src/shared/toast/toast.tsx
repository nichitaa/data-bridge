import * as React from 'react';
import { memo, ReactElement } from 'react';
import {
  Box,
  lighten,
  IconButton,
  Paper,
  PaperProps,
  SvgIcon,
  Typography,
} from '@mui/material';
import { TOAST_VARIANT, ToastVariant, ToastVariantProps } from './toast.types';
import { toastClasses, toastStyles } from './toast.constants';
import { styled } from '@mui/material/styles';
import { ToastContentProps } from 'react-toastify';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

export interface ToastProps extends ToastContentProps<unknown> {
  message: string;
  variant: ToastVariant;
}

export const variantIcons: ToastVariantProps<ReactElement> = {
  [TOAST_VARIANT.error]: <ErrorIcon />,
  [TOAST_VARIANT.success]: <CheckCircleIcon />,
  [TOAST_VARIANT.warning]: <WarningIcon />,
  [TOAST_VARIANT.info]: <InfoIcon />,
};

const Toast = memo((props: ToastProps) => {
  const { message, variant, closeToast } = props;

  return (
    <StyledToastPaper toastVariant={variant}>
      <Box className={toastClasses.content}>
        <SvgIcon
          viewBox={'0 0 24 24'}
          sx={{
            color: (theme) => theme.palette.toast[variant],
            fontSize: '20px',
          }}
        >
          {variantIcons[variant]}
        </SvgIcon>
        <Typography component={'div'} className={toastClasses.text}>
          {message}
        </Typography>
      </Box>
      <IconButton sx={{ p: '3px' }} onClick={closeToast}>
        <CloseIcon sx={{ fontSize: '20px' }} />
      </IconButton>
    </StyledToastPaper>
  );
});

/** ########################## Styled ########################### */

interface StyledToastPaperProps extends PaperProps {
  toastVariant: ToastVariant;
}

const StyledToastPaper = memo(
  styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'toastVariant',
  })<StyledToastPaperProps>(({ theme, toastVariant }) => ({
    // paper - wrapper
    background: lighten(theme.palette.background.default, 0.1),
    minHeight: toastStyles.minHeight,
    minWidth: toastStyles.minWidth,
    padding: '0 8px',
    border: `1px solid #414244`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // icon & message box
    [`& .${toastClasses.content}`]: {
      display: 'flex',
      alignItems: 'center',
      // message
      [`& .${toastClasses.text}`]: {
        color: theme.palette.toast[toastVariant],
        fontSize: '14px',
        paddingLeft: '5px',
        paddingRight: '8px',
      },
    },
  }))
);

export default Toast;
