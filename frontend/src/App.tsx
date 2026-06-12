import { useState } from 'react'
import TextEditor from './editor/TextEditor';


function App() {
  const [documentId, setDocumentId] = useState<number | null>(null);

  return (
    <div className="w-full h-screen overflow-hidden">
      <TextEditor />
    </div>
  );
}

export default App;