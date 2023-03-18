![](https://github.com/meetqy/eagleuse/raw/develop/readme/preview.gif?raw=true)

<p align='center'>
    <a href="https://github.com/meetqy/eagleuse/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/meetqy/eagleuse"/>
    </a>
    <a href="https://www.typescriptlang.org" target="_black">
        <img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language">
    </a>
    <a href="https://github.com/prettier/prettier" target="_black"> 
        <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"/> 
    </a>
</p>

<p align='center'>
    <a href='https://rao.pics'>线上演示</a> · <a href='https://github.com/rao-pics/core'>rao-pics</a>
</p>

## Rua

[rao-pics](https://github.com/rao-pics/core) 默认主题，支持 Ipad、暗黑模式、使用 nextjs 开发。

## 📷 截图

| Light                      | Dark                       |
| -------------------------- | -------------------------- |
| ![](./readme/preview1.jpg) | ![](./readme/preview2.jpg) |
| ![](./readme/preview6.jpg) | ![](./readme/preview4.jpg) |
| ![](./readme/preview5.jpg) | ![](./readme/preview3.jpg) |

## 👀 使用

在`.env`中配置

```sh
# 请求接口配置
API_HOST=
```

运行

```
pnpm i
pnpm dev
```

**如果你需要对主题进行二次开发，你还需要继续配置**

在`.env`中增加 `DATABASE_URL`

```sh
DATABASE_URL=library地址
```

然后执行脚本，通过 prisma 生成 type 类型文件

```
pnpm db:generate
```

> 如果类型依然报错，尝试重启 vscode

## ☞ License

Copyright (c) 2022 @rao-pics - [MIT](https://github.com/meetqy/eagleuse/blob/master/LICENSE)
