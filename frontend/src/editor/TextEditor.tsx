import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import Toolbar from './Toolbar';
import { documentService } from '../services/api';

export default function TextEditor() {
  const [documentId, setDocumentId] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Loading document...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8',
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
        
        // Inject the fetched content into the TipTap engine
        if (editor) {
          editor.commands.setContent(newDoc.content);
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
      }
    }

    // Only run this if the editor is ready and we don't have a document ID yet
    if (editor && !documentId) {
      initDocument();
    }
  }, [editor, documentId]); // Dependency array: React watches these variables

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col">
      <Toolbar editor={editor} />
      <div className="flex-grow">
        <EditorContent editor={editor} />
      </div>
      {/* A tiny status indicator for development */}
      <div className="text-xs text-gray-400 p-2 text-right border-t border-gray-100">
        {documentId ? `Connected: Doc #${documentId}` : 'Connecting to server...'}
      </div>
    </div>
  );
}