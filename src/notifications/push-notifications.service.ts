import { Injectable } from '@nestjs/common';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { messaging } from 'firebase-admin/lib/messaging/messaging-namespace';
import { chunk } from 'lodash';
import { mapLimit } from 'async';
import * as shell from 'shelljs';
import { NotificationType } from './notification.schema';

export interface PushNotificationMessageData {
  link?: string;
  deeplink?: string;
}

export interface PushNotificationMessage {
  token: string;
  title: string;
  message: string;
  data?: PushNotificationMessageData;
  type?: NotificationType;
}

@Injectable()
export class PushNotificationsService {
  constructor() {
    initializeApp({
      credential: cert({
        projectId: `${process.env.FIREBASE_PROJECT_ID}`,
        privateKey: `${
          process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n')
            : undefined
        }`,
        clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
      }),
    });
  }

  public async sendFirebaseMessages(
    messages: PushNotificationMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const batchesOfMessages = chunk(messages, 500);

    const batchResponses = await mapLimit<
      PushNotificationMessage[],
      BatchResponse
    >(
      batchesOfMessages,
      3, // 3 is a good place to start
      async (
        batchOfMessages: PushNotificationMessage[],
      ): Promise<BatchResponse> => {
        try {
          const fcmMessages: messaging.TokenMessage[] = batchOfMessages.map(
            ({ message, title, token, data, type }) => ({
              notification: { body: message, title },
              token,
              data: data as {
                [key: string]: string;
              },
              android: {
                notification: {
                  channelId: type || NotificationType.ANNOUNCEMENT,
                },
              },
              apns: {
                payload: {
                  aps: {
                    'content-available': 1,
                  },
                },
              },
            }),
          );

          return await this.sendAll(fcmMessages, dryRun);
        } catch (error) {
          return {
            responses: batchOfMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: batchOfMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      ({
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown) as BatchResponse,
    );
  }

  public async sendAll(
    messages: messaging.TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        shell.exec(
          `echo '{ "aps": { "alert": ${JSON.stringify(
            notification,
          )}, "token": "${token}" } }' | xcrun simctl push booted com.explore.btk -`,
        );
      }
    }

    return getMessaging().sendAll(messages, dryRun);
  }
}
