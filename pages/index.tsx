import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { LayoutContentRefContext, foldersState, rightBasicState } from "@/store";
import JustifyLayout from "@/components/JustifyLayout";
import { useInfiniteScroll } from "ahooks";
import Search from "@/components/Search";
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParams } from "use-query-params";
import { MoreListResult, getLoadMoreList } from "@/utils/getLoadmoreList";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Prisma } from "@raopics/prisma-client";
import { useCheckedFolderPwd } from "@/hooks";

interface Props {
  AND?: Prisma.Enumerable<Prisma.ImageWhereInput>;
  NOT?: Prisma.Enumerable<Prisma.ImageWhereInput>;
}

export interface PageHandle {
  reload: () => void;
}

const Page = forwardRef<PageHandle, Props>((props, ref) => {
  const router = useRouter();
  const isFirstReload = useRef(true);
  const LayoutContentRef = useContext(LayoutContentRefContext);
  const [rightBasic, setRightBasic] = useRecoilState(rightBasicState);
  const folders = useRecoilValue(foldersState);

  const [checkedFolderPwd] = useCheckedFolderPwd();

  // 密码验证未通过的文件夹
  const notPassFolders = useMemo(() => {
    return folders
      .filter((item) => {
        if (!item.password) return false;
        if (item.password && checkedFolderPwd.includes(item.id)) return false;
        return item;
      })
      .map((item) => item.id);
  }, [folders, checkedFolderPwd]);

  const [queryParams, setQueryParams] = useQueryParams({
    ext: StringParam,
    w: ArrayParam,
    h: ArrayParam,
    k: StringParam,
    page: NumberParam,
    // 是否需要reload url参数中出现 r=true
    // 会刷新当前页面，重新调用infiniteScroll.reload()
    r: BooleanParam,
    s: ArrayParam,
    n: BooleanParam,
  });

  const infiniteScroll = useInfiniteScroll<MoreListResult>(
    (d) => {
      const page = queryParams.page || 1;
      queryParams.page = d ? page + 1 : page;

      return getLoadMoreList(queryParams, {
        NOT: {
          ...props.NOT,
          folders: {
            some: { id: { in: notPassFolders } },
          },
        },
        AND: props.AND,
      });
    },
    {
      target: LayoutContentRef.current,
      threshold: 300,
      manual: true,
      isNoMore: (data) => {
        if (!data) return false;
        const { queryParams: query, pageSize, count } = data;
        const page = query.page || 1;

        setQueryParams({
          ...queryParams,
          page,
        });

        return page >= Math.ceil(count / pageSize);
      },
    }
  );

  useImperativeHandle(ref, () => ({
    reload() {
      infiniteScroll.reload();
    },
  }));

  useEffect(() => {
    const { data } = infiniteScroll;
    if (!data) return;

    if (rightBasic.fileCount != data?.count || rightBasic.fileSize != data.size) {
      setRightBasic({
        ...rightBasic,
        fileCount: data.count,
        fileSize: data.size,
      });
    }
  }, [infiniteScroll, infiniteScroll.data, rightBasic, setRightBasic]);

  // router 加载完成 首次加载
  useEffect(() => {
    if (router.isReady && isFirstReload.current) {
      isFirstReload.current = false;
      infiniteScroll.reload();
    }
  }, [router.isReady, queryParams, infiniteScroll]);

  // url ?r=true
  // 把page赋值为1
  useEffect(() => {
    if (queryParams.r) {
      setQueryParams({
        ...queryParams,
        page: 1,
      });
    }
  }, [queryParams, setQueryParams]);

  // queryParams.page === 1 && url ?r=true
  // 重新刷新并将滚动条回到顶部
  useEffect(() => {
    if (queryParams.page === 1 && queryParams.r) {
      setQueryParams({
        ...queryParams,
        r: undefined,
      });

      LayoutContentRef.current?.scrollTo({ top: 0 });
      infiniteScroll.reload();
    }
  }, [queryParams, infiniteScroll, setQueryParams, LayoutContentRef]);

  if (!infiniteScroll.data) return null;

  return <JustifyLayout infiniteScroll={infiniteScroll} header={<Search />} />;
});

Page.defaultProps = {
  AND: { isDeleted: false },
};

Page.displayName = "Page";

export default Page;
