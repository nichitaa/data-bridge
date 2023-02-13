import React, { memo } from 'react';
import { ToastContainer } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { toastClasses, toastStyles } from './toast.constants';
import { TOAST_VARIANT } from './toast.types';
import 'react-toastify/dist/ReactToastify.css';
import { Box, BoxProps } from '@mui/material';
import useToastNotifications from '../../hooks/use-toast-notifications';

const ToastProvider = memo(() => {
  useToastNotifications();
  return (
    <StyledToastWrapper>
      <ToastContainer
        // custom class names
        className={toastClasses.container}
        toastClassName={toastClasses.toast}
        bodyClassName={toastClasses.body}
        position='top-center'
        closeButton={false}
        autoClose={2000}
        closeOnClick={false}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        limit={15}
      />
    </StyledToastWrapper>
  );
});

/** ########################## Styled ########################### */

/** react-toastify general style overwrites */
const StyledToastWrapper = memo(
  styled(Box)<BoxProps>(({ theme, ...other }) => ({
    // toasts - container
    [`& .${toastClasses.container}`]: {
      width: 'auto',
      // on mobile - full width
      [theme.breakpoints.only('xs')]: {
        width: '100%',
      },
    },
    // single toast container
    [`.${toastClasses.toast}`]: {
      minHeight: toastStyles.minHeight,
      minWidth: toastStyles.minWidth,
      padding: 0,
      background: 'transparent',
      marginBottom: '8px',
      [`& .${toastClasses.body}`]: {
        padding: 0,
        margin: 0,
      },
      // progress bar
      [`& .${toastClasses.progressBar}`]: {
        height: '3px',
        // get background color for toast progress-bar, by toast variant (passed via classname)
        ...Object.keys(TOAST_VARIANT).reduce(
          (acc, key) => ({
            ...acc,
            [`&.${TOAST_VARIANT[key]}`]: {
              background: theme.palette.toast[key],
            },
          }),
          {}
        ),
      },
    },
  }))
);

export default ToastProvider;
