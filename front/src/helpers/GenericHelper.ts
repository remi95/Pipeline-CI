import dayjs from 'dayjs';

export const formatDateToLiteral = (date: string|undefined): string|null => (date
  ? dayjs(date).format('DD MMM YYYY')
  : null);
