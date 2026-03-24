# 部署到 Vercel（IMC 模拟器）

## 1. 本地准备

### 1.1 安装依赖

```bash
npm install
```

### 1.2 本地运行（可选）

```bash
npm run dev
```

如需指定端口：

```bash
npm run dev -- --port 3001
```

### 1.3 构建生产版本（建议先本地验证）

```bash
npm run build
```

如果本地 `build` 通过，就基本能确保 Vercel 构建会通过。

## 2. 环境变量需求

MVP 阶段**不需要任何后端数据库或业务环境变量**。

可选配置：

- 关闭 Next.js telemetry（非必须）

```bash
NEXT_TELEMETRY_DISABLED=1
```

如果不设置也不会影响功能。

## 3. 部署到 Vercel 步骤

1. 登录 [Vercel](https://vercel.com/) 并点击 `New Project`
2. 选择 `Import` 方式导入当前仓库
3. Framework 选择 `Next.js`
4. 配置 Build Command 与安装命令
   - Install Command（默认）：`npm install`
   - Build Command（默认）：`npm run build`
5. Create 并等待构建完成
6. 打开部署域名访问即可

说明：
- 这是纯前端离线版应用，不依赖后端服务，因此通常无需额外的部署配置。

## 4. 常见报错排查

### 4.1 `EACCES` / 权限错误（尤其本地）
- 不是代码问题，通常与系统/沙盒权限有关
- 在本地项目目录下确保你有写权限，并避免把 Next/缓存写到受限目录

### 4.2 `Turbopack` / Watcher 相关错误（本地 dev 常见）
- 只影响开发模式，不影响生产构建
- 建议你在部署前以 `npm run build` 作为最终验证标准

### 4.3 `Missing lockfile` / 依赖解析失败
- 确保仓库根目录存在 `package-lock.json`
- Vercel 默认会使用 lockfile 来安装依赖

### 4.4 构建通过但页面空白
- 检查浏览器控制台是否有运行时错误
- 确认你是否正确进入 `/play` 流程（例如 `?brand=beauty|tea|auto`）

### 4.5 Node 版本不匹配
- 建议使用 Node 18+（Vercel 默认也在此范围内）
- 本项目在 `package.json` 配置了 `engines.node >= 18`

