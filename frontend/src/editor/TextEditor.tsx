import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';

export default function TextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Start typing your document here...</p>',
    editorProps: {
      attributes: {
        // Tailwind classes applied directly to the typing area
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8',
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col">
      {/* Our custom Toolbar sits on top */}
      <Toolbar editor={editor} />
      
      {/* The actual typing area rendered by TipTap */}
      <div className="flex-grow">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}