import VConsole from "vconsole";

// 默认不显示 vConsole，仅在明确开启时加载
export default defineNuxtPlugin(() => {
    //new VConsole();
    try {
        const params = new URLSearchParams(window.location.search);
        const enableByQuery =
            params.get("debug") === "1" || params.get("vconsole") === "1";
        const enableByStorage = localStorage.getItem("ENABLE_VCONSOLE") === "1";
        const enableByDev = import.meta.env.DEV && false; // 开发环境也默认关闭

        if (enableByQuery || enableByStorage || enableByDev) {
            new VConsole();
        }
    } catch (e) {
        // 忽略初始化异常，避免影响页面正常渲染
    }
});
