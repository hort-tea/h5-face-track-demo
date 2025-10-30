# services

前端 API 调用封装目录。用于对 `useFetch`、`ofetch` 或 `axios` 做统一封装，并按业务模块暴露函数：

- `services/croppedImage.ts` 保存/读取裁切图片
- `services/signature.ts` 保存/读取签名

好处：调用端只依赖清晰函数，统一错误处理与重试策略，便于测试与复用。