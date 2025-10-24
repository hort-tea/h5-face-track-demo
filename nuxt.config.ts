// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    app: {
        baseURL: "/faces/",
    },
    css: [
        "cropperjs/dist/cropper.css"
    ],
    modules: ["@vueuse/nuxt", "@vant/nuxt", "@unocss/nuxt"],
});
