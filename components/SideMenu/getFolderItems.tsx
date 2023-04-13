import { ItemType } from "antd/es/menu/hooks/useItems";

export type CustomItemType = ItemType & { data: RaoPics.FolderTree };
export type CustomOnTitleClick = (key: string, item: RaoPics.FolderTree) => void;

function foldersTreeTransformItems(
  tree: RaoPics.FolderTree[],
  onTitleClick: CustomOnTitleClick
): CustomItemType[] {
  if (tree.length > 0) {
    return tree.map((item) => {
      const json: CustomItemType = {
        label: item.name,
        key: item.id,
        data: item,
        children: item.children ? foldersTreeTransformItems(item.children, onTitleClick) : [],
        onTitleClick: (info) => onTitleClick(info.key, item),
      };

      return json;
    });
  }

  return [];
}

export const getFolderItems = (tree: RaoPics.FolderTree[], onTitleClick: CustomOnTitleClick) => {
  return {
    label: `文件夹`,
    key: "/folders",
    type: "group",
    children: foldersTreeTransformItems(tree, onTitleClick) || [],
  };
};
