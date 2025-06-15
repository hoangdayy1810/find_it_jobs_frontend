import api from "@/utils/axios_catch_error_token";
import { makeAutoObservable, runInAction } from "mobx";
import { io, Socket } from "socket.io-client";

export interface INotification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface IPagination {
  totalNotifications: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

class NotificationStore {
  notifications: INotification[] = [];
  unreadCount: number = 0;
  socket: Socket | null = null;
  pagination: IPagination = {
    totalNotifications: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Initialize socket connection
  initSocket(userId: string, role: string) {
    // Close existing connection if any
    console.log("socket", userId, role);
    if (this.socket) {
      this.socket.disconnect();
    }

    // Connect to socket server with user info
    this.socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:10000",
      {
        query: {
          userId,
          role,
        },
      }
    );

    // Listen for new notifications
    this.socket.on("new_notification", (notification: INotification) => {
      runInAction(() => {
        this.notifications.unshift(notification);
        this.unreadCount += 1;
      });
    });

    // Listen for notification count updates
    this.socket.on("notification_count", (count: { count: number }) => {
      runInAction(() => {
        this.unreadCount = count.count;
      });
    });

    return this.socket;
  }

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get notifications with pagination
  async getNotifications(page: number = 1, limit: number = 10) {
    try {
      const response = await api.get("/api/notifications", {
        params: { page, limit },
      });
      if (response.data) {
        runInAction(() => {
          this.notifications = response.data.notifications || [];
          this.unreadCount = response.data.unreadCount || 0;

          // Update pagination data
          if (response.data.pagination) {
            this.pagination = response.data.pagination;
          }
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { success: false };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const response = await api.put(
        `/api/notifications/${notificationId}/read`
      );
      if (response.data.success) {
        runInAction(() => {
          const notification = this.notifications.find(
            (n) => n._id === notificationId
          );
          if (notification && !notification.isRead) {
            notification.isRead = true;
            this.unreadCount -= 1;
          }
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false };
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.put("/api/notifications/read-all");
      if (response.data) {
        runInAction(() => {
          this.notifications.forEach((notification) => {
            notification.isRead = true;
          });
          this.unreadCount = 0;
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false };
    }
  }
}

export const notificationStore = new NotificationStore();
