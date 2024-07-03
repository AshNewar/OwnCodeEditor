import React, { useEffect, useRef } from 'react'
import {Terminal as XTerminal} from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import socketConnection from '../socket';

const Terminal = () => {
    const terminalRef = useRef();
    const isDone  = useRef(false);

    useEffect(()=>{
        if(isDone.current) return;
        isDone.current = true;
        const term = new XTerminal({
            rows:100,
            cols:80,
        });
        term.open(terminalRef.current);

        term.onData((data)=>{
            console.log(data);
            socketConnection.emit('terminal:write',data);
        })

        socketConnection.on('terminal:data',(data)=>{
            term.write(data);
        })

        // return ()=>{
        //     socketConnection.off('terminal:data');
        // }
    },[])

  return (
    <div ref={terminalRef} id='terminal'></div>
  )
}

export default Terminal