import React, { useState } from 'react';
import { AppNotification } from '../types';
import { X, Bell, CheckCheck, Trash2, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onOpenTaskDetail?: (taskId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onOpenTaskDetail,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Notification Center
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread reminders` : 'All caught up!'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Bulk Actions Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'unread' ? 'bg-white text-[#10B981] shadow-2xs font-extrabold' : 'text-slate-500'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-2 rounded-xl bg-emerald-50 text-[#10B981] hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 pt-1 max-h-[50vh] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-extrabold text-slate-700">No Notifications</div>
              <div className="text-[10px] text-slate-400 font-medium">Your notification history is empty</div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const notifDate = new Date(notif.timestamp);
              const formattedTime = notifDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.targetId && onOpenTaskDetail) {
                      onOpenTaskDetail(notif.targetId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                      : 'bg-white border-emerald-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {notif.type === 'reminder' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : notif.type === 'task' ? (
                          <Calendar className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <Bell className="w-4 h-4 text-indigo-500" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-snug">
                          {notif.body}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {formattedTime}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
