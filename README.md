# 小红书签名测试环境 (XhsSign)

本项目包含了小红书 API 签名算法的独立测试环境，主要分为两个版本：

1. **Python 官方开源版本**（作为参照）
2. **TypeScript / Node.js 移植版本**（本插件的核心依赖）

本签名算法的底层原理和 Python 实现源于开源项目 [Cloxl/xhshow](https://github.com/Cloxl/xhshow)，本 Node.js 版本严格遵循了该项目中包含最新签名修复逻辑的 `PR #106` 版本进行 1:1 的移植重写。

## 目录结构

- `python/` - 包含 `xhshow` (PR #106) 的 Python 源码，用于对比测试和校验逻辑正确性。
- `js/` - 纯 TypeScript/Node.js 实现的版本。所有的加密、混淆和指纹采集算法均移植自原版 Python 仓库，脱离 Python 依赖，方便在 Node.js / 前端 / VS Code 插件环境中直接运行。

---

## 1. 测试 Python 版本

请确保你的环境中安装了 Python 3。
进入 `python` 目录，直接运行内置的测试脚本：

```bash
cd python
python test_run.py
```

执行后，脚本会发起一个真实的小红书主页推荐请求 `POST /api/sns/web/v1/homefeed`，在控制台打印出请求状态和返回数据。如果环境与算法正常，你会看到状态码为 `200` 的成功提示及接口的 JSON 响应。

---

## 2. 测试 TypeScript / Node.js 版本

进入 `js` 目录，这是配置好纯 TypeScript 签名库的独立 Node.js 工程。

首先，确保安装依赖（如果你是首次进入此文件夹，需要执行安装）：

```bash
cd js
npm install
```

依赖安装完成后，通过 `ts-node` 运行测试脚本：

```bash
npx ts-node test_run.ts
```

执行过程同样会请求小红书的 `/api/sns/web/v1/homefeed` 接口。测试脚本会自动调用 `XhsClient.sign` 生成请求所需的 `x-s`, `x-t`, `x-s-common` 以及相关的 `traceid`。如果底层签名正确，请求结果同样为状态码 `200` 并且能够正常输出 JSON 数据。

---

## 算法移植详情

TypeScript 版本的移植细节和组件如下：
1. **环境指纹采集 (`xhsFingerprint.ts` / `xhsFingerprintData.ts`)** - 生成包括 Canvas Hash、WebGL Hash、以及随机化的浏览器、显卡、屏幕尺寸等运行环境指纹，最终输出基于 ARC4 的 `b1` 参数。
2. **核心混淆工具 (`xhsCryptoUtils.ts`)** - 包含了 XOR 144字节混淆密钥操作、ARC4 流加密、基于三种变异字典的 Base64 (`STANDARD`、`CUSTOM`、`X3_BASE64`) 编解码方法。
3. **数据加解密处理器 (`xhsCryptoProcessor.ts`)** - 集成了基于时间戳、请求参数 (Payload / Query)、Cookie 里的 `a1` 字段，以及自定义哈希算法（`custom_hash_v2`），最终拼装出供加密和编码的二进制缓冲区数组。
4. **客户端与签名管理器 (`xhsClient.ts` / `xhsConfig.ts`)** - 统一的封装层，暴露 `sign(apiPath, payload, cookie, method)` 接口供上层直接调用。

> **注意事项**：  
> `test_run.ts` 和 `test_run.py` 内部使用了一组固定的、包含 `a1` 及 `web_session` 等关键认证字段的 Cookie 用于演示测试。  
> 若你在测试过程中遇到了 HTTP `406` 或 `401` 错误，往往是因为代码里写死的 Cookie 已经过期失效。此时只需要将测试文件中的 `COOKIE` 常量替换为你在真实浏览器里登录后获取的最新 Cookie 即可跑通。
