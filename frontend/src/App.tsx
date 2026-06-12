import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TextEditor from './editor/TextEditor';
import DocumentsList from './pages/DocumentsList';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#f8f9fa] overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/:id" element={<TextEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;