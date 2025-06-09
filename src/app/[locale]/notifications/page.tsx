"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNotification, useUser } from "@/contexts/AppContext";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";
import { INotification } from "@/stores/notificationStore";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { useTranslations } from "next-intl";

const NotificationsPage = observer(() => {
  const t = useTranslations();
  const notificationStore = useNotification();
  const userStore = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      await notificationStore?.getNotifications(currentPage);
      setLoading(false);
    };

    fetchNotifications();
  }, [notificationStore, currentPage]);

  const handleMarkAllAsRead = async () => {
    await notificationStore?.markAllAsRead();
  };

  const handleNotificationClick = async (notification: INotification) => {
    // Mark notification as read
    await notificationStore?.markAsRead(notification._id);

    // Navigate to the appropriate page based on notification type
    if (
      notification.type === "application" &&
      notification.data?.applicationId
    ) {
      if (userStore?.user?.role === "employer" && notification.data?.jobId) {
        router.push(
          `/employer/myjobs/${notification.data.jobId}/applications/${notification.data.applicationId}`
        );
      } else {
        router.push(`/candidate/myapplies/${notification.data.applicationId}`);
      }
    } else if (
      notification.type === "job_status_change" &&
      notification.data?.applicationId
    ) {
      router.push(`/jobs/${notification.data.applicationId}`);
    }
  };

  // Handle page change from pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const { totalPages } = notificationStore?.pagination || { totalPages: 1 };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : notificationStore?.notifications.length === 0 ? (
        <div className="min-h-96 bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-lg text-gray-600">No notifications yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-1 bg-green-100 p-4 rounded-lg shadow-sm">
            {notificationStore?.notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                  notification.isRead ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`${
                        notification.isRead ? "font-normal" : "font-semibold"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDistance(
                        new Date(notification.createdAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <AdvancedPagination
              t={t}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
});

export default NotificationsPage;
