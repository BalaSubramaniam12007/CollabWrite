import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService, type DocumentModel } from '../services/api';

export default function DocumentsList() {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    documentService.getAllDocuments().then(setDocuments).catch(console.error);
  }, []);

  const handleCreateNew = async () => {
    try {
      const newDoc = await documentService.createDocument();
      navigate(`/documents/${newDoc.id}`);
    } catch (error) {
      console.error('Error creating document', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + New Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="border rounded-lg p-6 hover:shadow-lg cursor-pointer transition-shadow bg-white"
            onClick={() => navigate(`/documents/${doc.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{doc.title || 'Untitled Document'}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Created: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
            <p className="text-gray-600 line-clamp-3 text-sm">
              {doc.content ? doc.content.replace(/<[^>]+>/g, '') : 'No content'}
            </p>
          </div>
        ))}
        {documents.length === 0 && (
           <p className="text-gray-500 italic">No documents found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
