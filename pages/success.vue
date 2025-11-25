<template>
    <div class="container mx-auto">
        <div class="box-border px-6 pt-24">
            <van-empty>
                <div
                    class="flex flex-col items-center space-y-2 justify-center"
                >
                    <div>验证成功</div>
                    <div class="text-sm color-stone">验证已通过</div>
                </div>
                <template #image>
                    <div
                        class="flex h-full text-9xl color-green items-center justify-center"
                    >
                        <div class="i-tabler:discount-check-filled"></div>
                    </div>
                </template>
            </van-empty>
        </div>
    </div>
</template>
<script lang="ts" setup>
onMounted(() => {
    const router = useRouter();
    try {
        localStorage.clear();
    } catch (e) {}
    router.replace(router.currentRoute.value.fullPath);
    if (typeof window !== "undefined") {
        const preventBack = () => {
            history.pushState(null, document.title, location.href);
        };
        history.pushState(null, document.title, location.href);
        window.addEventListener("popstate", preventBack);
        onUnmounted(() => {
            window.removeEventListener("popstate", preventBack);
        });
    }
});
</script>
