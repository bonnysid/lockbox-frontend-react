declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.wav';
declare module '*.webp';

declare module '*.scss';

interface NotificationData {
  type: 'stand' | 'sit';
  time?: number;
}

interface IStore {
  sitDownSeconds: number;
  standUpSeconds: number;
  isStanding: boolean;

  timer?: NodeJS.Timeout | null;
}

interface Window {
  electronAPI: {
    sendStoreAction: (event: string) => void;
    onStoreUpdate: (callback: (state: IStore) => void) => void;
    requestStore: () => void;
    closeNotification: () => void;
  };
}
