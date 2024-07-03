
import { useState } from 'react'
import './App.css'
import FileStructure from './components/FileStructure'
import Terminal from './components/Terminal'
import EditorFile from './components/Editor';

function App() {
  const [selectedFile,setFile] = useState('');

  const beautifyPath = (path) => {
    const parts = path.replace(/^\./, '').split('/');
    return parts.join(' > ');
  };

  

  return (
   <div>
    <div className='upper'>
      <div className="files">
        <h2>Files</h2>
        <div>
          <FileStructure onSelect={(path)=>{
            setFile(path);
          }}/>
        </div>
      </div>
      <div className="editor">
        <h3>Editor</h3>
        <p>{beautifyPath(selectedFile)}</p>
        <div style={{padding:"5px"}}>
          <EditorFile selectedFile={selectedFile}/>
        </div>
      </div>
      <div className='terminal'>
      <Terminal/>
    </div>
    </div>
   
   </div>
  )
}

export default App
