"use client";

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

// ============================================================
// NOTIFICATIONS
// Toast notification stack with auto-dismiss and animations.
// ============================================================

const ICON_MAP = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

const ICON_COLOR_MAP = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const removeNotification = useUIStore((s) => s.removeNotification);
  const Icon = ICON_MAP[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-right-5 fade-in-0 duration-300",
        COLOR_MAP[notification.type]
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", ICON_COLOR_MAP[notification.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{notification.title}</p>
        <p className="text-xs text-white/60 mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="shrink-0 text-white/40 hover:text-white/70 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Notifications() {
  const notifications = useUIStore((s) => s.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col gap-2 w-80">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
