import { chess } from '../../store/chess';
import { Square as ChessSquare } from 'chess.js';
import { useState } from 'react';
import { StyledPieceImage, StyledSquare } from './commonStyle';
import { socket } from '../../sockets/chess-socket';
import { useRecoilValue } from 'recoil';
import { chessRoomInfoAtom } from '../../store/atoms/chess';

interface IProps {
  piece: any;
  squareName: string;
  updateBoard: () => void;
  setPromoting: () => void;
  setPromotionInfo: (data: { from: ChessSquare, to: ChessSquare }) => void;
}

const Square = ({ piece, squareName, updateBoard, setPromoting, setPromotionInfo }: IProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const roomInfo = useRecoilValue(chessRoomInfoAtom);

  const onDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    if (piece) {
      e.dataTransfer.setData('squareName', squareName);
      e.dataTransfer.setData('color', piece.color);
      e.dataTransfer.setData('type', piece.type);
      setIsDragging(true);
    }
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData('squareName');
    const color = e.dataTransfer.getData('color');
    const type = e.dataTransfer.getData('type');

    const isPromoting = type === 'p' && ((color === 'w' && squareName[1] === '8') || (color === 'b' && squareName[1] === '1'));
    const move = { from: fromSquare as ChessSquare, to: squareName as ChessSquare };

    if (isPromoting) {
      if ((piece && fromSquare[0] !== squareName[0] && color !== piece.color) || (!piece && fromSquare[0] === squareName[0])) {
        setPromoting();
        setPromotionInfo(move);
      }
    } else if (chess.move(move)) {
      socket.emit('chess-move', move);
      updateBoard();
    }

    setIsDragging(false);
  }

  return <StyledSquare onDrop={onDrop} onDragOver={(e) => e.preventDefault()} isLightSquare={chess.square_color(squareName) === 'light'}>
    {piece ? <StyledPieceImage
      draggable={piece && roomInfo.isPlayer && roomInfo.color === piece.color && chess.turn() === piece.color}
      onDragStart={onDragStart}
      onDragEnd={() => setIsDragging(false)}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      src={`/images/${piece.color}${piece.type.toUpperCase()}.png`} /> : null}
  </StyledSquare>
}

export default Square;
