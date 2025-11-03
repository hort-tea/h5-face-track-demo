// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devServer: {
        port: 3000,
    },
    devtools: { enabled: true },
    app: {
        baseURL: "/faces/",
    },
    vite: {
        server: {
            proxy: {
                "/face-similarity.php": {
                    target: "https://10.0.10.80/faces",
                    changeOrigin: true,
                    rewrite: (path) =>
                        path.replace(/^\/face-similarity.php/, ""),
                },
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
