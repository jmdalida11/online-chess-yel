import { atom } from "recoil";

export const chessRoomInfoAtom = atom<any>({
  key: 'chessRoomInfoAtom',
  default: { inGame: false, isPlayer: false },
});
