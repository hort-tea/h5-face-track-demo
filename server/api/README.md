# server/api

Nuxt 3 服务端 API 路由目录。放置以文件为路由的后端接口，例如：

- `server/api/cropped-image.post.ts` 保存裁切后的图片
- `server/api/signature.get.ts` 获取当前签名

文件命名建议：`资源.方法.ts`（如 `user.post.ts`、`user.get.ts`）。

接口会自动暴露在 `/api/*` 路径下。