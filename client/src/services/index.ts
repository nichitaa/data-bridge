import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { MainService } from './main.service';
import { DbService } from './db.service';

export const authService = AuthService.getInstance();
export const mainService = MainService.getInstance();
export const dbService = DbService.getInstance();
export const notificationService = NotificationService.getInstance();
