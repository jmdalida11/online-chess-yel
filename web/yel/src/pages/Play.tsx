import { useState } from 'react';
import styled from 'styled-components';
import Board from '../components/chess/Board';

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const Play = () => {
  const [reverseBoard, setReverseBoard] = useState(false);

  return <div>
      <button onClick={() => { setReverseBoard(!reverseBoard) }}>Reverse Board</button>
      <BoardContainer>
        <Board isReverse={reverseBoard} />
        {/* <Board isReverse={reverseBoard} /> */}
      </BoardContainer>
    </div>
}

export default Play;