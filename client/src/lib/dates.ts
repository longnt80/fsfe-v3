import { format } from 'date-fns';

export function today() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy');
}
