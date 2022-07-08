import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Board from '../components/chess/Board';
import GameRooms from '../components/GameRoom';
import { socket } from '../sockets/chess-socket';
import { chessRoomInfoAtom } from '../store/atoms/chess';
import { chess } from '../store/chess';

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Play = () => {
  const [reverseBoard, setReverseBoard] = useState(false);
  const [roomInfo, setRoomInfo] = useRecoilState(chessRoomInfoAtom);
  const [roomName, setRoomName] = useState('');
  const [roomIds, setRoomIds] = useState([]);

  useEffect(() => {
    socket.on('created-game-info', (data) => {
      console.log(data);
      if (data?.isSuccess) {
        setRoomInfo({ ...roomInfo, inGame: true, color: data.color, isPlayer: true });
        setReverseBoard(data.color === 'b');
      }
    });

    socket.on('joined-game-info', (data) => {
      console.log(data);
      if (data?.isSuccess) {
        chess.load(data.fen);
        setRoomInfo({ ...roomInfo, inGame: true, color: data.color, isPlayer: data.isPlayer });
        setReverseBoard(data.color === 'b');
      }
      setRoomName(data.roomName);
    });

    socket.on('get-room-ids', (data) => {
      setRoomIds(data);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGameRoom = () => {
    if (roomName === '') {
      alert("Please Enter Room Name");
      return;
    }
    socket.emit('create-game-room', { roomName: roomName });
  }

  const joinGameRoom = (roomId: string) => {
    socket.emit('join-game-room', { roomId });
  }

  return <div>
    <ButtonsContainer>
      {!roomInfo.inGame && <div>
        <button onClick={createGameRoom}>Create Room</button>
        <input type="text" onChange={(e) => setRoomName(e.target.value)} value={roomName} placeholder="Room Name" />
      </div>}
      {roomInfo.inGame && <div>
        <button onClick={() => { setReverseBoard(!reverseBoard) }}>Reverse Board</button>
        <h2>Room name: <i>{roomName}</i></h2>
      </div>}
    </ButtonsContainer>
    {roomInfo.inGame && <BoardContainer>
      <Board isReverse={reverseBoard} />
    </BoardContainer>}
    {!roomInfo.inGame && <GameRooms joinRoom={joinGameRoom} rooms={roomIds} />}
  </div>
}

export default Play;
