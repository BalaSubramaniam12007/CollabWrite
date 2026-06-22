import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';
import TopBar from './TopBar';
import { documentService } from '../services/api';

import { useCollaboration } from '../hooks/useCollaboration';
import { useAutoSave } from '../hooks/useAutoSave';

export default function TextEditor() {
  const { id } = useParams<{ id: string }>();
  
  const documentId = id ?? null; 
  
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("Untitled Document");
  const isRemoteUpdate = useRef(false);

  // debounce 
  const { debouncedSave } = useAutoSave(documentId, title);
    
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Loading...</p>',
    onUpdate: ({ editor }) => {
      if (isRemoteUpdate.current) return;
      const html = editor.getHTML();

      broadcastChange(html); 
      debouncedSave(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[1056px] w-[816px] bg-white shadow-md border border-gray-200 mx-auto px-20 py-16 mb-20',
      },
    },
  });

  const { broadcastChange } = useCollaboration(documentId, editor, isRemoteUpdate);

  useEffect(() => {
    async function initDocument() {
      if (documentId && editor) {
        try {
          const doc = await documentService.getDocument(documentId);
          setTitle(doc.title || "Untitled Document");
          isRemoteUpdate.current = true;
          editor.commands.setContent(doc.content || '<p></p>');
          isRemoteUpdate.current = false;
        } catch (error) {
          navigate('/documents');
        }
      }
    }
    initDocument();
  }, [editor, documentId, navigate]);

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