import { atom } from "recoil";

export const tagsState = atom({
  key: "tagsState",
  default: [] as RaoPics.TagWithCountImage[],
});

export const foldersState = atom({
  key: "foldersState",
  default: [] as (RaoPics.FolderTree & { images?: RaoPics.Image[]; _count?: { images: number } })[],
});
