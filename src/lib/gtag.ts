export const GA_TRACKING_ID = 'G-FZ7F8H6QJ6';
export const pageview = (url: string): void => {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  };
  
  type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
  };
  
  export const event = ({ action, category, label, value }: GTagEvent): void => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  };
  
  declare global {
    interface Window {
      gtag: (
        command: 'config' | 'event' | 'js',
        targetId: string | Date,
        config?: Record<string, any>
      ) => void;
    }
  }
  