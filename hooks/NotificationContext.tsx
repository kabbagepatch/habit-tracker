import React, { createContext, useContext, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  const showNotification = (msg: string, t: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={3000}
          style={{ backgroundColor: type === 'error' ? 'hsl(0, 70%, 45%)' : 'hsl(142, 50%, 40%)' }}
        >
          {message}
        </Snackbar>
      </Portal>
    </NotificationContext.Provider>
  );
}
