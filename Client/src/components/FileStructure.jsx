import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'
import socketConnection from '../socket';

import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';


const FileStructure = ({onSelect}) => {
  const [tree, setTree] = useState(null);

  const fetchTree = async () => {
    try {
      const response = await axios.get('http://localhost:9000/files');
      setTree(response.data.tree);
    } catch (error) {
      console.error('Error fetching directory tree:', error);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  useEffect(()=>{
    socketConnection.on('files:refresh',fetchTree);
    return () =>{
      socketConnection.off('files:refresh',fetchTree);
    }
  },[])

  const findPath = (arr, pathArr, index = 0, currentPath = './user') => {
    if (index >= pathArr.length) {
      return currentPath;
    }
  
    const nodeIndex = pathArr[index];
    const nodeName = arr[nodeIndex].name;
  
    const newPath = currentPath === '' ? nodeName : `${currentPath}/${nodeName}`;
  
    return findPath(arr[nodeIndex].children || [], pathArr, index + 1, newPath);
  };

  const handleNameClick=(event,data)=>{
    const {nodeData} = event;
    console.log(nodeData);
    if(nodeData.type=='folder') return;
    const pathOfFile = findPath(tree.children,nodeData.path);
    console.log(pathOfFile);
    onSelect(pathOfFile)

  }

  return (
    <div>
    {tree ? (
      <FolderTree
        data={tree}
        showCheckbox={ false }   
        onNameClick={(event,data)=>handleNameClick(event,data)}
      />
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
};

export default FileStructure;
