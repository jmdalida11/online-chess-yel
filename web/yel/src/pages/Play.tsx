import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Board from '../components/chess/Board';
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
  const [roomId, setRoomId] = useState('');
  const [roomInfo, setRoomInfo] = useRecoilState(chessRoomInfoAtom);
  const [playerName, setPlayerName] = useState('');

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
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGameRoom = () => {
    if (roomId === '') {
      return;
    }
    socket.emit('create-game-room', { roomId, playerName });
  }

  const joinGameRoom = () => {
    socket.emit('join-game-room', { roomId, playerName });
  }

  return <div>
    <ButtonsContainer>
      {!roomInfo.inGame && <div>
        <button onClick={createGameRoom}>Create Room</button>
        <button onClick={joinGameRoom}>Join Room</button>
        <input type="text" onChange={(e) => setRoomId(e.target.value)} value={roomId} placeholder="Enter Room Id" />
        <input type="text" onChange={(e) => setPlayerName(e.target.value)} value={playerName} placeholder="Player Name" />
      </div>}
      {roomInfo.inGame && <button onClick={() => { setReverseBoard(!reverseBoard) }}>Reverse Board</button>}
    </ButtonsContainer>
    {roomInfo.inGame && <BoardContainer>
      <Board isReverse={reverseBoard} />
    </BoardContainer>}
  </div>
}

export default Play;
