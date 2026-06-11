import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import TextEditor from './editor/TextEditor';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">BALA Mass</h1>
      </header>
      
      <main>
        <TextEditor />
      </main>
    </div>
  );
}

export default App;