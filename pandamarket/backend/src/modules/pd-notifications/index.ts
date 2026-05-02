// pandamarket/backend/src/modules/pd-notifications/index.ts
import PdNotificationService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_NOTIFICATIONS_MODULE = 'pdNotificationService';

export default Module(PD_NOTIFICATIONS_MODULE, {
  service: PdNotificationService,
});
