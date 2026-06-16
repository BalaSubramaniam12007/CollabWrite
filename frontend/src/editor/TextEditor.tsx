import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Toolbar from './Toolbar';
import TopBar from './TopBar';
import { documentService } from '../services/api';

// Generate a random ID for this specific browser session
const MY_CLIENT_ID = Math.random().toString(36).substring(7);

export default function TextEditor() {
  const { id } = useParams<{ id: string }>();
  const documentId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Document");
  
  // Refs to manage WebSocket state without causing re-renders
  const stompClient = useRef<Client | null>(null);
  const isRemoteUpdate = useRef(false);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Loading...</p>',
    onUpdate: ({ editor }) => {
      // If the update came from the WebSocket, do NOT broadcast it back
      if (isRemoteUpdate.current) return;

      const html = editor.getHTML();

      // 1. Broadcast the change to other users via WebSocket
      if (stompClient.current?.connected && documentId) {
        stompClient.current.publish({
          destination: `/app/document/${documentId}`,
          body: JSON.stringify({ senderId: MY_CLIENT_ID, content: html }),
        });
      }

      // 2. Debounce the REST API save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        if (documentId) {
          documentService.updateDocument(documentId, title, html).catch(console.error);
        }
      }, 1000); 
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[1056px] w-[816px] bg-white shadow-md border border-gray-200 mx-auto px-20 py-16 mb-20',
      },
    },
  });

  // Fetch initial content via REST
  useEffect(() => {
    async function initDocument() {
      if (documentId && editor) {
        try {
          const existingDoc = await documentService.getDocument(documentId);
          setTitle(existingDoc.title || "Untitled Document");
          // Mark as remote so we don't accidentally broadcast the initial load
          isRemoteUpdate.current = true;
          editor.commands.setContent(existingDoc.content || '<p></p>');
          isRemoteUpdate.current = false;
        } catch (error) {
          navigate('/documents');
        }
      }
    }
    initDocument();
  }, [editor, documentId, navigate]);

  // Establish WebSocket Connection
  useEffect(() => {
    if (!documentId || !editor) return;

    const socket = new SockJS('http://localhost:8080/ws-document');
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        // Subscribe to this specific document's topic
        client.subscribe(`/topic/document/${documentId}`, (message) => {
          const body = JSON.parse(message.body);

          // Only update the editor if the message came from someone else
          if (body.senderId !== MY_CLIENT_ID) {
            isRemoteUpdate.current = true; // Prevent echo loop
            // TipTap preserves the cursor position pretty well when using setContent
            editor.commands.setContent(body.content);
            isRemoteUpdate.current = false;
          }
        });
      },
    });

    client.activate();
    stompClient.current = client;

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }, [documentId, editor]);

  // Auto-save title changes (REST)
  useEffect(() => {
    if (documentId && editor) {
      const timeout = setTimeout(() => {
        documentService.updateDocument(documentId, title, editor.getHTML()).catch(console.error);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [title, documentId, editor]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <TopBar documentId={documentId} title={title} onTitleChange={setTitle} />
      <div className="sticky top-0 z-10 bg-[#f8f9fa] pb-4 px-4 shadow-sm">
        <Toolbar editor={editor} />
      </div>
      <div className="flex-grow overflow-y-auto pt-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}