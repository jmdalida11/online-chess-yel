import { Server } from 'socket.io';
import { Chess } from './lib/chess';

const socket = new Server(5001, { cors: { origin: '*' } });

const chessGamesMap = new Map();

socket.on('connection', (client) => {
  client.on('disconnect', (reason)=>{
    console.log(reason);
  });

  client.on('create-game-room', async (data) => {
    const roomName = `chess-game-room-${data.roomId}`;
    console.log('Room Created with name of', roomName);

    if (chessGamesMap.has(roomName)) {
      client.emit('created-game-info', { isSuccess: false });
      return;
    }

    client.join(roomName);

    const color = Math.random() > 0.5 ? 'w' : 'b';

    const info = {
      color,
      isSuccess: true,
    };

    // @ts-ignore
    const chess = new Chess();
    chessGamesMap.set(roomName, {
      chess,
      whitePlayer: color === 'w' ? { id: client.id, name: data.playerName } : null,
      blackPlayer: color === 'b' ? { id: client.id, name: data.playerName } : null,
    });

    client.emit('created-game-info', info);
  });

  client.on('join-game-room', (data) => {
    const roomName = `chess-game-room-${data.roomId}`;
    console.log('Joining room', roomName);

    if (chessGamesMap.has(roomName)) {
      const gameInfo = chessGamesMap.get(roomName);
      const info = {
        roomName,
        fen: gameInfo.chess.fen(),
        isPlayer: false,
        color: 'w',
        isSuccess: true,
      };

      if (gameInfo.whitePlayer === null || client.id === gameInfo.whitePlayer) {
        gameInfo.whitePlayer = { id: client.id, name: data.playerName };
        info.isPlayer = true;
        info.color = 'w';
      } else if (gameInfo.blackPlayer === null || client.id === gameInfo.blackPlayer) {
        gameInfo.blackPlayer = { id: client.id, name: data.playerName };
        info.isPlayer = true;
        info.color = 'b';
      }

      client.join(roomName);
      client.emit('joined-game-info', info);
    } else {
      client.emit('joined-game-info', { isSuccess: false });
    }
  });

  client.on('chess-move', (data) => {
    const roomName = Array.from(client.rooms)[1];
    if (chessGamesMap.has(roomName)) {
      const gameInfo = chessGamesMap.get(roomName);

      if (gameInfo.chess.move(data)) {
        client.to(roomName).emit('chess-move', data);
      }
    }
  });
});
