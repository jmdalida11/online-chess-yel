import { Server } from 'socket.io';
import { Chess } from './lib/chess';
import { v4 as uuid } from 'uuid';

enum ConnectionEvent {
  CreateRoom = 'create-game-room',
  JoinRoom = 'join-game-room',
  ChessMove = 'chess-move',
}

enum ConnectionEmit {
  CreateGameInfo = 'created-game-info',
  JoinedGameInfo = 'joined-game-info',
  ChessMove = 'chess-move',
  GetRoomIds = 'get-room-ids'
}

class GameRoom {
  private readonly socket;
  private readonly gameMap = new Map();

  constructor() {
    this.socket = new Server(5001, { cors: { origin: '*' } });
  }

  public connection() {
    this.socket.on('connection', (client) => {
      client.emit(ConnectionEmit.GetRoomIds, this.getRoomsAvailable());
      this.createRoom(client);
      this.joinRoom(client);
      this.chessMove(client);
      this.disconnect(client);
    });
  }

  public disconnect(client: any) {
    // client.on("disconnect", async () => {
    //   const connected = await this.socket.in(client).fetchSockets();
    //   if (connected.length === 0) {
    //     this.socket.in("room1").socketsLeave("room1");
    //   }
    // });
  }

  private getRoomsAvailable() {
    const rooms: any = [];

    this.gameMap.forEach((room, roomId) => {
      rooms.push({
        roomId,
        roomName: room.roomName
      });
    });

    return rooms;
  }

  private createRoom(client: any) {
    client.on(ConnectionEvent.CreateRoom, async (data: any) => {
      const roomId = uuid();

      client.join(roomId);

      const color = Math.random() > 0.5 ? 'w' : 'b';

      const info = {
        color,
        isSuccess: true,
      };

      // @ts-ignore
      const chess = new Chess();
      this.gameMap.set(roomId, {
        chess,
        roomName: data.roomName,
        whitePlayer: color === 'w' ? { id: client.id } : null,
        blackPlayer: color === 'b' ? { id: client.id } : null,
      });

      client.emit(ConnectionEmit.CreateGameInfo, info);
      this.socket.emit(ConnectionEmit.GetRoomIds, this.getRoomsAvailable());
    });
  }

  private joinRoom(client: any) {
    client.on(ConnectionEvent.JoinRoom, (data: any) => {
      const roomId = data.roomId;

      if (this.gameMap.has(roomId)) {
        const gameInfo = this.gameMap.get(roomId);
        const info = {
          roomId,
          roomName: gameInfo.roomName,
          fen: gameInfo.chess.fen(),
          isPlayer: false,
          color: 'w',
          isSuccess: true,
        };

        if (gameInfo.whitePlayer === null || client.id === gameInfo.whitePlayer) {
          gameInfo.whitePlayer = { id: client.id };
          info.isPlayer = true;
          info.color = 'w';
        } else if (gameInfo.blackPlayer === null || client.id === gameInfo.blackPlayer) {
          gameInfo.blackPlayer = { id: client.id };
          info.isPlayer = true;
          info.color = 'b';
        }

        client.join(roomId);
        client.emit(ConnectionEmit.JoinedGameInfo, info);
      } else {
        client.emit(ConnectionEmit.JoinedGameInfo, { isSuccess: false });
      }
    });
  }

  private chessMove(client: any) {
    client.on(ConnectionEvent.ChessMove, (data: any) => {
      const roomId = Array.from(client.rooms)[1];
      if (this.gameMap.has(roomId)) {
        const gameInfo = this.gameMap.get(roomId);

        if (gameInfo.chess.move(data)) {
          client.to(roomId).emit(ConnectionEmit.ChessMove, data);
        }
      }
    });
  }
}

const gameRoom = new GameRoom();
gameRoom.connection();
