import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import Toolbar from './Toolbar';
import TopBar from './TopBar';
import { documentService } from '../services/api';

export default function TextEditor() {
  const [documentId, setDocumentId] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing here...</p>',
    editorProps: {
      attributes: {
        // Core Paper Styling: A4 Dimensions, shadow, centered.
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[1056px] w-[816px] bg-white shadow-md border border-gray-200 mx-auto px-20 py-16 mb-20',
      },
    },
  });

  // The Effect Hook: Runs exactly once when the component mounts
  useEffect(() => {
    async function initDocument() {
      try {
        // For Phase 1, we will just create a new document every time the page loads.
        // Later, we will grab the ID from the URL (e.g., /doc/1)
        const newDoc = await documentService.createDocument();
        setDocumentId(newDoc.id);
      } catch (error) {
        console.error("Failed to connect to backend:", error);
      }
    }
    if (editor && !documentId) {
      initDocument();
    }
  }, [editor, documentId]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <TopBar documentId={documentId} />
      
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