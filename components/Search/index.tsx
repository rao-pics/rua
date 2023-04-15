import { Col, Row, Space, theme } from "antd";
import SearchCondition from "./condition";
import DarkMode from "../DarkMode";
import NSFW from "../NSFW";
import Link from "next/link";
import { useMount } from "ahooks";
import { useRef } from "react";

const Search = () => {
  const { token } = theme.useToken();
  const showTitle = useRef(false);

  useMount(() => {
    showTitle.current = location.href.includes("rao.pics");
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: token.colorBgLayout,
        zIndex: token.zIndexPopupBase,
        padding: 12,
      }}
    >
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <Space>
            <SearchCondition.Keyword />
            <SearchCondition.Ext />
            <SearchCondition.Size />
          </Space>
        </Col>
        {showTitle.current && (
          <Col>
            <Space>
              <Link target="_blank" href={"https://my.hostkvm.com/aff.php?aff=1594"}>
                本站服务器由 HostKvm 提供
              </Link>
            </Space>
          </Col>
        )}
        <Col>
          <Space>
            <NSFW />
            <SearchCondition.Sort />
            <DarkMode />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Search;
