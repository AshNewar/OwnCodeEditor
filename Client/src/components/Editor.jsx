import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import socketConnection from '../socket';
import axios from 'axios';

function EditorFile({selectedFile}) {
  const [code, setCode] = useState('// Select File To Start Coding')

  const fileContent=async()=>{
    if(selectedFile.length==0) return;
    try {
        const response  = await axios.get(`http://localhost:9000/files/content?path=${selectedFile}`);
        // const content = response;
        console.log('Content',response.data.code);
        setCode(response.data.code)
    } catch (error) {
        console.log(error);   
    } 
  }

  useEffect(()=>{
    fileContent();
  },[selectedFile])

  useEffect(()=>{
    if(code && selectedFile.length>0){
        const timer = setTimeout(()=>{
            console.log(code,selectedFile);
            socketConnection.emit('file:change',{
                path:selectedFile,
                content:code
            })
        },5*1000)

        return ()=>{
            clearTimeout(timer);
        }
    }
    
  },[code])

  return (
    <Editor
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 16,
      }}
    />
  );
}
export default EditorFile;