# Rewrite Studio

一个给改写、仿写、整理语料用的小工具。

你可以把参考案例、待改写素材、系统提示词放在一起管理，然后一键复制成完整语料，丢给 AI 继续处理。

在线访问：

https://kanshao2077.github.io/rewrite-studio/

## 它能做什么

- 管理多个改写项目。
- 给每个项目保存参考案例。
- 单独维护待改写素材。
- 单独维护系统提示词。
- 自动把“参考案例 + 新素材 + 提示词”拼成一份完整语料。
- 数据自动保存在当前浏览器里。

## 注意

这个工具没有后端数据库，数据存在你自己的浏览器本地。

换电脑、换浏览器、清理浏览器数据，都可能导致内容丢失。重要项目要及时导出或复制保存。

## 本地运行

需要先安装 Node.js，建议 20 或以上版本。

```bash
npm install --no-package-lock
npm run dev
```

打开终端里显示的网址，就能在本地预览。

## 打包

```bash
npm run build
```

打包结果会生成在 `dist` 目录。

## 部署到 GitHub Pages

这个仓库已经带了 GitHub Pages 自动部署配置。

以后只要把代码推送到 `main` 分支，GitHub 会自动打包并发布到：

https://kanshao2077.github.io/rewrite-studio/

## 来源

这个项目来自秒哒导出的源码包。

原应用链接：

https://www.miaoda.cn/projects/app-9cpvm9o98gsh
