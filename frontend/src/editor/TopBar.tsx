import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { documentService } from '../services/api';

type TopBarProps = {
  documentId: string | null;
  title: string;
  onTitleChange: (title: string) => void;
};

export default function TopBar({ documentId, title, onTitleChange }: TopBarProps) {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!documentId) return;

    const confirmed = window.confirm(
      `Delete "${title || 'Untitled Document'}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await documentService.deleteDocument(documentId);
      navigate('/documents');
    } catch (error) {
      console.error('Failed to delete document', error);
      alert('Could not delete the document. Please try again.');
    }

    setIsFileMenuOpen(false);
  };

  return (
    <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-300">
      <div className="flex items-center gap-4">
        {/* Logo acting as Home Button */}
        <Link to="/documents" className="text-blue-600 font-bold text-3xl pb-1 hover:opacity-80">
          🐼
        </Link>
        
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-medium text-gray-800 text-lg hover:border-gray-300 border border-transparent rounded px-1 -ml-1 outline-none focus:border-blue-500 bg-transparent"
          />
          <div className="flex gap-3 text-sm text-gray-500 mt-0.5 -ml-1 relative">
            {/* File menu with dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFileMenuOpen((open) => !open)}
                className="hover:bg-gray-100 px-1.5 rounded cursor-pointer"
              >
                File
              </button>

              {isFileMenuOpen && (
                <>
                  {/* Click-away overlay: closes the menu if you click outside it */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFileMenuOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-20 py-1">
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Delete document
                    </button>
                  </div>
                </>
              )}
            </div>

            <button className="hover:bg-gray-100 px-1.5 rounded cursor-pointer">Edit</button>
            <button className="hover:bg-gray-100 px-1.5 rounded cursor-pointer">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}