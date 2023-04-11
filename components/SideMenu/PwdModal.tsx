import { LockTwoTone } from "@ant-design/icons";
import { useSessionStorageState } from "ahooks";
import { Input, Modal, Space, Typography, message } from "antd";
import { encode } from "js-base64";
import { useEffect, useState } from "react";

interface Props {
  item: EagleUse.FolderTree;
  open: boolean;
  onChange: (open: boolean) => void;
}

const PwdModal = ({ item, open, onChange }: Props) => {
  const [sessionPwd, setSessionPwd] = useSessionStorageState<{ [key in string]: string }>("folder-passwrod", {
    defaultValue: {},
  });
  const [pwd, setPwd] = useState<string>();

  useEffect(() => {
    setPwd(undefined);
  }, [open]);

  return (
    <Modal
      bodyStyle={{ display: "flex", justifyContent: "center" }}
      open={open}
      onOk={() => {
        if (!pwd) return message.error("密码不正确！");
        const _pwd = encode(pwd);
        if (_pwd !== item.password) return message.error("密码不正确！");
        sessionPwd[item.id] = _pwd;
        setSessionPwd(sessionPwd);
        onChange(false);
      }}
      onCancel={() => {
        setPwd(undefined);
        onChange(false);
      }}
    >
      <Space direction="vertical" size={"middle"} style={{ width: "65%", textAlign: "center", padding: 20 }}>
        <LockTwoTone style={{ fontSize: 108 }} />
        <Typography.Text style={{ fontSize: 24 }} strong>
          输入密码查看内容
        </Typography.Text>
        <Typography.Text type="secondary">密码提示：{item.passwordTips}</Typography.Text>
        <Input value={pwd} type="password" onChange={(e) => setPwd(e.target.value)} />
      </Space>
    </Modal>
  );
};

export default PwdModal;
