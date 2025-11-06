import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocketNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to user-specific queues
        const queues = [
          `/user/queue/application-status-${userId}`,
          `/user/queue/application-assignment-${userId}`
        ];

        queues.forEach(queue => {
          client.subscribe(queue, (message) => {
            try {
              const body = JSON.parse(message.body);
              setNotifications(prev => [...prev, body]);
            } catch (e) {
              console.error("Failed to parse notification message", e);
            }
          });
        });
      },
      onDisconnect: () => { }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  return notifications;
};

export default useWebSocketNotifications;
