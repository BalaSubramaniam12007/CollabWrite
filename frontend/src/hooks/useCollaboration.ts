import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Editor } from '@tiptap/react';

const MY_CLIENT_ID = Math.random().toString(36).substring(7);

export function useCollaboration(
  documentId: string | null,
  editor: Editor | null,
  isRemoteUpdate: React.MutableRefObject<boolean>
) {
  const stompClient = useRef<Client | null>(null);

  // 1. Establish connection
  useEffect(() => {
    if (!documentId || !editor) return;

    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/document/${documentId}`, (message) => {
          const body = JSON.parse(message.body);
          if (body.senderId !== MY_CLIENT_ID) {
            isRemoteUpdate.current = true;
            editor.commands.setContent(body.content);
            isRemoteUpdate.current = false;
          }
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [documentId, editor, isRemoteUpdate]);

  // 2. Return a function so the editor can broadcast changes
  const broadcastChange = (html: string) => {
    if (stompClient.current?.connected && documentId) {
      stompClient.current.publish({
        destination: `/app/document/${documentId}`,
        body: JSON.stringify({ senderId: MY_CLIENT_ID, content: html }),
      });
    }
  };

  return { broadcastChange };
}