import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PromptProvider } from './context/PromptContext';
import IDELayout from './components/IDELayout';
import './styles/vscode-theme.css';
import './styles/ide-components.css';

function App() {
  return (
    <PromptProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/how-it-works" replace />} />
        <Route path="/how-it-works" element={<IDELayout />} />
        <Route path="/stage/:stageId" element={<IDELayout />} />
      </Routes>
    </PromptProvider>
  );
}

export default App;
