<template>
    <Teleport to="body">
        <Transition name="fs">
            <div
                v-show="visible"
                class="fixed inset-0 z-[1000] flex items-center justify-center"
            >
                <div class="absolute inset-0 bg-white"></div>
                <div
                    class="relative flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="i-tabler:loader-2 text-gray-700 text-4xl animate-spin"
                    ></div>
                    <div class="text-gray-700 text-base font-medium mt-3">
                        {{ message }}
                    </div>
                    <div
                        v-if="subMessage"
                        class="text-gray-500 text-sm mt-1"
                    >
                        {{ subMessage }}
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: "加載中...",
    },
    subMessage: {
        type: String,
        default: "",
    },
});
</script>

<style scoped>
.fs-enter-active,
.fs-leave-active {
    transition: opacity 0.2s ease;
}
.fs-enter-from,
.fs-leave-to {
    opacity: 0;
}

/* */
</style>
