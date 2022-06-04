import { atom } from "recoil";

export const sideBarOpenAtom = atom<boolean>({
  key: 'sideBarOpenAtom',
  default: false,
});