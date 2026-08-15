"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type Toast = { id: number; message: string };

type ToastContextValue = {
  announce: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  const announce = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message }]);
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timers.current.delete(id);
    }, 2400);
    timers.current.set(id, timer);
  }, []);

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-40 flex justify-center px-5"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            className="toast-shadow rounded-[8px] bg-ink px-4 py-3 text-[0.9375rem] leading-[1.4] text-canvas"
          >
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("ToastProvider가 필요합니다.");
  }
  return context;
}
