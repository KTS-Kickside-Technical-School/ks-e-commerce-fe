import { format } from 'date-fns';

export const formatTimeDate = (dateString: any) => {
    try {
        const date = new Date(dateString);
        return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};