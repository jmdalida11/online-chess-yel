import styled from 'styled-components';

export const StyledSquare = styled.div<{ isLightSquare: boolean }>`
  width: 70px;
  height: 70px;
  background-color: ${({ isLightSquare }) => isLightSquare ? '#f0d9b5' : '#b58863'};
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const StyledPieceImage = styled.img`
  width: 50px;
  height: 50px;
`;