
import { createContext, useRef } from 'react';

export const EditorContext = createContext({
  clearEditor: () => {},
  registerEditor: (editor) => {},
});

export const EditorProvider = ({ children }) => {
  const editorRef = useRef(null);

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.value = '';
    }
  };

  const registerEditor = (editor) => {
    editorRef.current = editor;
  };

  return (
    <EditorContext.Provider value={{ clearEditor, registerEditor }}>
      {children}
    </EditorContext.Provider>
  );
};