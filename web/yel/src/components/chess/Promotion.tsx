import styled from 'styled-components';
import { StyledPieceImage, StyledSquare } from './commonStyle';

const Container = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  border-radius: 26px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Modal = styled.div<{ width?: number; padding?: string; height?: number }>`
  position: fixed;
  ${({ width }) => (width ? `width: ${width}px;` : '')}
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 26px;
  box-shadow: 0 24px 38px 0 rgba(86, 85, 84, 0.5);
  background-color: white;
  padding: ${({ padding }) => (padding ? padding : '0px 25px;')};
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

interface IProps {
  isOpen: boolean;
  pieceColor: string;
  promote: (pieceType: string) => void;
}

const Promotion = ({ pieceColor, isOpen, promote }: IProps) => {
  return <Container open={isOpen}>
    <Modal padding={'20px'}>
      <StyledSquare isLightSquare={true}>
        <StyledPieceImage src={`/images/${pieceColor}Q.png`} onClick={() => { promote('q'); }} />
      </StyledSquare>
      <StyledSquare isLightSquare={false}>
        <StyledPieceImage src={`/images/${pieceColor}R.png`} onClick={() => { promote('r'); }} />
      </StyledSquare>
      <StyledSquare isLightSquare={true}>
        <StyledPieceImage src={`/images/${pieceColor}B.png`} onClick={() => { promote('b'); }} />
      </StyledSquare>
      <StyledSquare isLightSquare={false}>
        <StyledPieceImage src={`/images/${pieceColor}N.png`} onClick={() => { promote('n'); }} />
      </StyledSquare>
    </Modal>
  </Container>
}

export default Promotion;