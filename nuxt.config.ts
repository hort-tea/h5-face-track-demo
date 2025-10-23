// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    app: {
        baseURL: "/faces/",
    },
    modules: ["@vueuse/nuxt", "@vant/nuxt", "@unocss/nuxt"],
    css: ["vue-advanced-cropper/dist/style.css"],
});
