import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationsLiveDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createNotificationsLiveDto);

    this.server.emit('notification', { added: notification });
    return notification;
  }
}
