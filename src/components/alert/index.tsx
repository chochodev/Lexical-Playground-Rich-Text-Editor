'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert as NextUIAlert } from '@heroui/react';
import { LuX } from 'react-icons/lu';
import { useAlertStore } from '@/store';

export default function Alert() {
  const { alert, closeAlert } = useAlertStore();

  // Automatically close the alert after 6 seconds
  useEffect(() => {
    if (alert.isOpen) {
      // console.log('alert.isOpen', alert.isOpen);
      const timer = setTimeout(() => closeAlert(), 6000);
      return () => clearTimeout(timer);
    }
  }, [alert.isOpen, closeAlert]);

  if (!alert.isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {alert.isOpen && (
        <motion.div
          initial={{ translateY: -20 }}
          animate={{ translateY: 0 }}
          exit={{ translateY: -20 }}
          transition={{ duration: 0.25, ease: 'easeInOut', type: 'spring' }}
          className="fixed left-0 top-12 z-[200] flex w-full justify-center"
        >
          <div className="w-full max-w-[24rem] shadow-md">
            <NextUIAlert
              color={alert.type}
              title={
                alert.title ||
                (alert.type
                  ? alert.type.charAt(0).toUpperCase() + alert.type.slice(1)
                  : 'Alert')
              }
              endContent={
                <button
                  onClick={closeAlert}
                  className="ease-300 my-auto flex size-[2rem] min-w-[2rem] items-center justify-center rounded-lg bg-white/80 hover:bg-white"
                >
                  <LuX className="text-black" />
                </button>
              }
            >
              <p className="text-[0.8125rem]">{alert.message}</p>
            </NextUIAlert>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
