import { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 border-b border-gray-300 p-2 bg-gray-50 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded font-bold ${
          editor.isActive('bold') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
        }`}
      >
        B
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded italic ${
          editor.isActive('italic') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
        }`}
      >
        I
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-3 py-1 rounded line-through ${
          editor.isActive('strike') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
        }`}
      >
        S
      </button>
    </div>
  );
}