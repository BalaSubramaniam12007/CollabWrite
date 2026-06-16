// Define the shape of our data so TypeScript can catch errors
export interface DocumentModel {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = 'https://collabwrite-4fjd.onrender.com/api/documents';

export const documentService = {
  // 1. Create a blank document in PostgreSQL
  createDocument: async (): Promise<DocumentModel> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Document', content: '' }),
    });
    return response.json();
  },

  // 2. Fetch a specific document by its ID
  getDocument: async (id: number): Promise<DocumentModel> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Document not found');
    return response.json();
  },

  getAllDocuments: async (): Promise<DocumentModel[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  // 3. Update an existing document's content
  updateDocument: async (id: number, title: string, content: string): Promise<DocumentModel> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT', // PUT is the standard HTTP method for updating entire resources
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return response.json();
  },

  // 4. Delete a document
  deleteDocument: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document');
  }
};