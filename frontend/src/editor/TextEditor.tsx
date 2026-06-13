import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';
import TopBar from './TopBar';
import { documentService } from '../services/api';

export default function TextEditor() {
  const { id } = useParams<{ id: string }>();
  const documentId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Document");

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing here...</p>',
    onUpdate: ({ editor }) => {
      if (documentId) {
        // Auto-save on edit
        documentService.updateDocument(documentId, title, editor.getHTML()).catch(console.error);
      }
    },
    editorProps: {
      attributes: {
        // Core Paper Styling: A4 Dimensions, shadow, centered.
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[1056px] w-[816px] bg-white shadow-md border border-gray-200 mx-auto px-20 py-16 mb-20',
      },
    },
  });

  // Auto-save on title change
  useEffect(() => {
    if (documentId && editor) {
      const timeout = setTimeout(() => {
        documentService.updateDocument(documentId, title, editor.getHTML()).catch(console.error);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [title, documentId, editor]);

  // The Effect Hook: Runs exactly once when the component mounts
  useEffect(() => {
    async function initDocument() {
      try {
        if (documentId) {
          const existingDoc = await documentService.getDocument(documentId);
          setTitle(existingDoc.title || "Untitled Document");
          editor?.commands.setContent(existingDoc.content || '<p>Start typing here...</p>');
        } else {
          navigate('/documents');
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        navigate('/documents');
      }
    }
    if (editor) {
      initDocument();
    }
  }, [editor, documentId, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <TopBar documentId={documentId} title={title} onTitleChange={setTitle} />
      
      {/* Sticky Toolbar container */}
      <div className="sticky top-0 z-10 bg-[#f8f9fa] pb-4 px-4 shadow-sm">
        <Toolbar editor={editor} />
      </div>
      
      {/* Scrollable Document Area */}
      <div className="flex-grow overflow-y-auto pt-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}