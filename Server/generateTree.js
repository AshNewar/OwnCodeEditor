import fs from 'fs/promises';
import path from 'path';

export const generateTree = async (directory) => {
  const buildTree = async (curDir) => {
    const children = [];
    const files = await fs.readdir(curDir);

    for (const file of files) {
      const filepath = path.join(curDir, file);
      const stats = await fs.stat(filepath);
      if (stats.isDirectory()) {
        children.push({
          name: file,
          type: 'folder',
          children: await buildTree(filepath),
        });
      } else {
        children.push({
          name: file,
          type: 'file',
        });
      }
    }
    return children;
  };

  return {
    name: path.basename(directory),
    type: 'folder',
    children: await buildTree(directory),
  };
};
