import { MyLayout } from "@/components/Layout";
import { RecoilRoot, useRecoilState } from "recoil";
import zhCN from "antd/locale/zh_CN";
import "antd/dist/reset.css";
import "@/styles/global.css";
import { ConfigProvider, theme as AntdTheme } from "antd";
import Head from "next/head";
import Pkg from "@/package.json";
import { QueryParamProvider } from "use-query-params";
import { NextAdapter } from "next-query-params";
import { AppProps } from "next/app";
import { CheckFolderPwdState, ThemeState } from "@/hooks";
import { useMount } from "ahooks";

export default function MyApp(props: AppProps) {
  return (
    <RecoilRoot>
      <QueryParamProvider adapter={NextAdapter}>
        <Container {...props} />
      </QueryParamProvider>
    </RecoilRoot>
  );
}

const Container = ({ Component, pageProps }: AppProps) => {
  const [theme] = useRecoilState(ThemeState);
  const [, setCheckFolderPwd] = useRecoilState(CheckFolderPwdState);

  useMount(() => {
    setCheckFolderPwd(JSON.parse(sessionStorage.getItem("checked-folder-password") || "") || []);
  });

  return (
    <>
      <Head>
        <title>{`${Pkg.name.toLocaleUpperCase()} - ${Pkg.description}`}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={`${Pkg.description} - ${Pkg.name.toLocaleUpperCase()}`} />
      </Head>
      <ConfigProvider
        theme={{
          algorithm: theme === "light" ? AntdTheme.defaultAlgorithm : AntdTheme.darkAlgorithm,
        }}
        locale={zhCN}
      >
        <MyLayout>
          <Component {...pageProps} />
        </MyLayout>
      </ConfigProvider>
    </>
  );
};
