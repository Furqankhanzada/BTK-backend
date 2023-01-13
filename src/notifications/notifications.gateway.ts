import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationsliveDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createNotificationsliveDto);

    this.server.emit('notification', { added: notification });

    console.log('CREATE NOTIFICATION with Server Listener', notification);
    return notification;
  }
}
