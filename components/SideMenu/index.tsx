import { foldersState, rightBasicState } from "@/store";
import { transformFolderToTree } from "@/utils";
import {
  FileImageOutlined,
  FileUnknownOutlined,
  TagsOutlined,
  DeleteOutlined,
  FolderOpenFilled,
  FolderFilled,
  LockFilled,
  UnlockFilled,
} from "@ant-design/icons";
import { Menu, MenuProps, theme } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CustomItemType, CustomOnTitleClick, getFolderItems } from "./getFolderItems";
import { useRouter } from "next/router";
import { useMount } from "ahooks";
import PwdModal from "./PwdModal";
import { useCheckedFolderPwd } from "@/hooks";

const baseItems: MenuProps["items"] = [
  { label: "全部", icon: <FileImageOutlined />, key: "/" },
  { label: "未标签", icon: <FileUnknownOutlined />, key: "/not-tag" },
  { label: "标签管理", icon: <TagsOutlined />, key: "/tags" },
  { label: "回收站", icon: <DeleteOutlined />, key: "/recycle" },
  { type: "divider" },
];

type CustomExpendIcon = CustomItemType & { isOpen: boolean; isSubMenu: boolean; eventKey: string };

const SideMenu = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const router = useRouter();
  const { token } = theme.useToken();
  const [rightBasic, setRightBasic] = useRecoilState(rightBasicState);
  const [curFolder, setCurFolder] = useState<RaoPics.FolderTree>();

  const [checkedFolderPwd] = useCheckedFolderPwd();

  const [pwdOpen, setPwdOpen] = useState<boolean>(false);

  // 文件夹
  const folders = useRecoilValue(foldersState);
  const foldersTree = useMemo(() => transformFolderToTree(folders), [folders]);
  const [folderItems, setFolderItems] = useState<MenuProps["items"]>([]);
  const isFolderInit = useRef(false);

  const setRightBasicByName = useCallback(
    (className: string) => {
      setTimeout(() => {
        const doms = document.querySelectorAll(`.${className}`);
        const wrapper = doms[doms.length - 1];
        if (!wrapper) return;
        const selectDom = wrapper.querySelector(".ant-menu-title-content");
        if (selectDom && selectDom.innerHTML != rightBasic.name) {
          setRightBasic({
            ...rightBasic,
            image: undefined,
            name: selectDom?.innerHTML,
          });
        }
      });
    },
    [setRightBasic, rightBasic]
  );

  // 选中文件夹  只有文件夹才有 id 参数
  useEffect(() => {
    if (router.isReady) {
      const pathname = "/" + router.pathname.split("/")[1];

      if (pathname.includes("folder")) {
        const { id } = router.query;
        setSelectedKeys([id as string]);
        const folder = folders.find((item) => item.id === id);

        if (folder && folder.pid) {
          setOpenKeys([folder.pid]);
        }
      } else {
        setSelectedKeys([pathname]);
      }

      setRightBasicByName("ant-menu-item-selected");
      setRightBasicByName("ant-menu-submenu-selected");
    }
  }, [router, folders, setRightBasicByName]);

  useMount(() => {
    const { route } = router;
    if (route === "/") return setSelectedKeys(["/"]);
    if (route.includes("/not-tag")) return setSelectedKeys(["/not-tag"]);
    if (route.includes("/tags")) return setSelectedKeys(["/tags"]);
    if (route.includes("/recycle")) return setSelectedKeys(["/recycle"]);
  });

  const folderIconClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, props: CustomExpendIcon) => {
    e.stopPropagation();

    const { eventKey = "" } = props;

    const index = openKeys.indexOf(eventKey);
    index > -1 ? openKeys.splice(index, 1) : openKeys.push(eventKey);
    setOpenKeys([...openKeys]);
  };

  const onTitleClick = useCallback<CustomOnTitleClick>(
    (key, item) => {
      if (!checkedFolderPwd.includes(item.id) && item.password) {
        setCurFolder(item);
        return setPwdOpen(true);
      }

      router.push(`/folder/${key}`);
      setRightBasicByName("ant-menu-submenu-selected");
    },
    [checkedFolderPwd, router, setRightBasicByName]
  );

  useEffect(() => {
    if (!isFolderInit.current && foldersTree.length > 0) {
      setFolderItems([getFolderItems(foldersTree, onTitleClick)]);
    }
  }, [foldersTree, onTitleClick, openKeys]);

  const items = useMemo(() => baseItems.concat(folderItems || []), [folderItems]);

  return (
    <>
      <style jsx global>{`
        .ant-menu-submenu-selected > div:first-child {
          background-color: ${token.colorPrimaryBg}!important;
          color: ${token.colorPrimaryTextActive}!important;
        }

        .ant-menu-submenu > div:first-child {
          padding-left: 24px !important;
        }

        .ant-menu-submenu .ant-menu-submenu-title {
          flex-direction: row-reverse;
        }

        .ant-menu-submenu .ant-menu-title-content {
          padding-left: 12px;
        }
      `}</style>

      {curFolder && <PwdModal open={pwdOpen} item={curFolder} onChange={setPwdOpen} />}

      <Menu
        openKeys={openKeys}
        expandIcon={(props) => {
          const _props = props as CustomExpendIcon;
          const { isOpen, data } = _props;

          return isOpen ? (
            data.password ? (
              <UnlockFilled onClick={(e) => folderIconClick(e, _props)} />
            ) : (
              <FolderOpenFilled onClick={(e) => folderIconClick(e, _props)} />
            )
          ) : data.password ? (
            <LockFilled onClick={(e) => folderIconClick(e, _props)} />
          ) : (
            <FolderFilled onClick={(e) => folderIconClick(e, _props)} />
          );
        }}
        selectedKeys={selectedKeys}
        mode="inline"
        items={items}
        onClick={(e) => {
          router.push(e.key === "/tags" ? e.key + "/manage" : e.key);
          setRightBasicByName("ant-menu-item-selected");
        }}
      />
    </>
  );
};

export default SideMenu;
