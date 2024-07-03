import express from 'express'
import http from 'http'
import {Server as SocketServer} from 'socket.io'
import pty from 'node-pty'
import { generateTree } from './generateTree.js';
import cors from "cors"
import chokidar from 'chokidar'
import fs from 'fs/promises';

const app = express();
const server = http.createServer(app);

const io = new SocketServer({
    cors:'*',
})
app.use(cors({
    origin:'*'
}))

var ptyProcess = pty.spawn("bash", [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
    env: process.env
  });
  
ptyProcess.onData((data) => {
    io.emit('terminal:data',data)   
})

io.attach(server);

chokidar.watch('./user').on('all', (event, path) => {
    io.emit('files:refresh',path);
  });

io.on('connection',(socket)=>{
    console.log('User Connected')

    socket.on('file:change',async({path,content})=>{
        // console.log('path' ,path);
        await fs.writeFile(path,content)
    })

    socket.on('terminal:write',(data)=>{
        ptyProcess.write(data)
    })
})

app.get('/files',async(req,res)=>{
    const files = await generateTree('./user');
    return res.status(200).json({tree:files});
})

app.get('/files/content',async(req,res)=>{
    const path = req.query.path;
    const code = await fs.readFile(path,'utf-8');
    return res.json({code});
})

server.listen(9000,()=>{
    console.log('Docker Instances Running At Port',9000)
})