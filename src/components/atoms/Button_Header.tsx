"use client";

import { useNotification, useUser } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface MyComponentProps {
  src: string;
  text: string;
  style: string;
  id: string;
}

const Button_Header: React.FC<MyComponentProps> = observer(
  ({ src, text, style, id }) => {
    const router = useRouter();
    const userStore = useUser();
    const notificationStore = useNotification();
    const [isClient, setIsClient] = useState(false);

    // Initialize socket connection when user is logged in
    useEffect(() => {
      const fetchData = async () => {
        if (userStore?.user?._id) {
          await notificationStore?.initSocket(
            userStore.user._id,
            userStore.user.role
          );
          console.log("done");
          console.log(
            notificationStore?.unreadCount,
            typeof notificationStore?.unreadCount,
            "unreadCount"
          );
          // notificationStore.getNotifications();

          return async () => {
            await notificationStore?.disconnectSocket();
          };
        }
      };

      fetchData();

      setIsClient(true);
    }, [userStore]);

    const handleButton_Header = () => {
      if (userStore && userStore.user) {
        if (id === "notification") {
          router.push("/notifications");
        } else if (id === "account" && userStore.user.role === "candidate") {
          router.push("/candidate/profile");
        } else if (id === "account" && userStore.user.role === "employer") {
          router.push("/employer/profile");
        }
      } else router.push("/login");
    };

    return (
      <div onClick={handleButton_Header} className="cursor-pointer">
        <div className="relative">
          <img src={src} alt="logo" className={style} />
          {id === "notification" && isClient && userStore?.user && (
            <div className="absolute bottom-4 right-0 px-1 text-xs text-white rounded-full bg-red-500">
              {notificationStore?.unreadCount &&
              notificationStore?.unreadCount > 99
                ? "99+"
                : notificationStore?.unreadCount}
            </div>
          )}
        </div>

        {id === "account" && isClient && userStore?.user ? (
          <p className="hidden md:block mt-1 text-xs text-slate-500">
            {userStore.user.userName.length >= 10
              ? userStore.user.userName.slice(0, 7) + "..."
              : userStore.user.userName}
          </p>
        ) : (
          <p className="text-xs mt-1 text-slate-500">{text}</p>
        )}
      </div>
    );
  }
);

export default Button_Header;
