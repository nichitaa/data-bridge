import React, { useCallback, useEffect } from 'react';
import { useObservable } from 'rxjs-hooks';
import { ToastVariant } from '../shared/toast/toast.types';
import { toast } from 'react-toastify';
import Toast from '../shared/toast/toast';
import { toastClasses } from '../shared/toast/toast.constants';
import { notificationService } from '../services';

const useToastNotifications = () => {
  const notification = useObservable(
    () => notificationService.notificationStream
  );

  const notify = useCallback((variant: ToastVariant, message: string) => {
    toast((props) => <Toast variant={variant} message={message} {...props} />, {
      progressClassName: `${toastClasses.progressBar} ${variant}`,
    });
  }, []);

  useEffect(() => {
    if (notification) {
      notify(notification.variant, notification.message);
    }
  }, [notification]);
};

export default useToastNotifications;
