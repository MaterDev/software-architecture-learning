import React from 'react';
import { PromptProvider } from './context/PromptContext';
import IDELayout from './components/IDELayout';
import './styles/vscode-theme.css';
import './styles/ide-components.css';

function App() {
  return (
    <PromptProvider>
      <IDELayout />
    </PromptProvider>
  );
}

export default App;
