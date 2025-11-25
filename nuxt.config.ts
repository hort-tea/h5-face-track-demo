// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devServer: {
        port: 3000,
    },
    devtools: { enabled: false },
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL,
        head: {
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no",
                },
            ],
        },
    },
    vite: {
        server: {
            proxy: {
                // "/face-similarity.php": {
                //     target: "https://10.0.10.80/faces",
                //     changeOrigin: true,
                //     rewrite: (path) =>
                //         path.replace(/^\/face-similarity.php/, ""),
                // },
                "/face-similarity.php": {
                    target: "https://check1.cheertravel.com.hk/faces",
                    changeOrigin: true,
                    rewrite: (path) => {
                        return path.replace(/^\/face-similarity.php/, "");
                    },
                },
                // "/face-similarity.php": {
                //     target: "https://vfy.tbkservice.cn/faces",
                //     changeOrigin: true,
                //     rewrite: (path) => {
                //         return path.replace(/^\/face-similarity.php/, "");
                //     },
                // },
                // "/face-similarity.php": {
                //     target: "http://192.168.100.246/faces",
                //     changeOrigin: true,
                //     rewrite: (path) =>
                //         path.replace(/^\/face-similarity.php/, ""),
                // },
                // "/api": {
                //     target: "http://10.0.10.16:8000",
                //     changeOrigin: true,
                //     rewrite: (path) => path.replace(/^\/api/, ""),
                // },
            },
        },
    },
    css: ["cropperjs/dist/cropper.css"],
    modules: ["@vueuse/nuxt", "@vant/nuxt", "@unocss/nuxt"],
});
