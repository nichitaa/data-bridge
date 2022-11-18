import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { MainService } from './main.service';

export const authService = AuthService.getInstance();
export const mainService = MainService.getInstance();
export const notificationService = NotificationService.getInstance();
