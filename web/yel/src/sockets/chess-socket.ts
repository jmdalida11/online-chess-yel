import { io } from "socket.io-client";

const PORT = '5001';
const URL = 'http://192.168.100.135';
//const URL = 'http://localhost';

export const socket = io(`${URL}:${PORT}`);
