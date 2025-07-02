'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from '@/context/notificationContext';
import { ToastNotification } from '@/components/global';

export const NotificationsDisplay = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-4 pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        {notifications.map((notif) => (
          <ToastNotification
            key={notif.id}
            id={notif.id}
            message={notif.message}
            title={notif.title}
            type={notif.type}
            duration={notif.duration}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};