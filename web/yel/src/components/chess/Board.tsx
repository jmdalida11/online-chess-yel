import { useEffect, useState } from "react";
import styled from 'styled-components';
import { chess, SQUARE_NAME } from "../../store/chess";
import { Square as ChessSquare } from 'chess.js';
import Promotion from "./Promotion";
import Square from "./Square";
import { socket } from "../../sockets/chess-socket";

const Rank = styled.div`
  display: flex;
`;

interface IProps {
  isReverse: boolean;
}

type PieceType = "b" | "q" | "n" | "r" | undefined;

const Board = ({ isReverse }: IProps) => {
  const [board, setBoard] = useState(chess.board());
  const [isPromoting, setIsPromoting] = useState<boolean>(false);
  const [promotionInfo, setPromotionInfo] = useState<{ from: ChessSquare, to: ChessSquare } | null>(null);

  const updateBoard = () => {
    setBoard(chess.board());
  }

  const renderSquares = (row: any, rowIndex: number) => {
    return row.map((piece: any, colIndex: number) =>
      <Square
        key={`Square-key-${rowIndex}-${colIndex}`}
        piece={piece}
        updateBoard={updateBoard}
        squareName={SQUARE_NAME[rowIndex][colIndex]}
        setPromoting={() => { setIsPromoting(true); }}
        setPromotionInfo={(data) => { setPromotionInfo(data); }}
      />);
  }

  const renderBoard = () => {
    return board.map((row: any, rowIndex: number) => {
      return <Rank key={`Rank-key-${rowIndex}`}>{isReverse ? renderSquares(row, rowIndex).reverse() : renderSquares(row, rowIndex)}</Rank>;
    });
  }

  const promote = (pieceType: string) => {
    setIsPromoting(false);

    if (promotionInfo) {
      const move = { from: promotionInfo.from, to: promotionInfo.to, promotion: pieceType as PieceType };
      if (chess.move(move)) {
        socket.emit('chess-move', move);
        updateBoard();
      }
    }
    setPromotionInfo(null);
  }

  useEffect(() => {
    socket.on('chess-move', (data) => {
      console.log('move', data);
      if (chess.move(data)) {
        updateBoard();
      }
    });
  }, []);

  return <div>
    {isReverse ? renderBoard().reverse() : renderBoard()}
    <Promotion promote={promote} isOpen={isPromoting} pieceColor={chess.turn()} />
  </div>
}

export default Board;
