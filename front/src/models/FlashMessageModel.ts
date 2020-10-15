export enum FlashMessageType {
  INFO = 'info',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

export interface FlashMessage {
  message: string;
  type: FlashMessageType;
}
