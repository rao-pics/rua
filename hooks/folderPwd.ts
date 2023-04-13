import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const _name = "checked-folder-password";

export const CheckFolderPwdState = atom({
  key: _name,
  default: [] as string[],
});

export function useCheckedFolderPwd() {
  const state = useRecoilState(CheckFolderPwdState);
  const [value] = state;

  useEffect(() => {
    sessionStorage.setItem(_name, JSON.stringify(value));
  }, [value]);

  return state;
}
