import {io} from 'socket.io-client'

const socketConnection = io('http://localhost:9000')

export default socketConnection;