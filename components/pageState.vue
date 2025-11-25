<template>
    <div class="container mx-auto">
        <div class="box-border px-6 pt-24">
            <van-empty>
                <div
                    class="flex flex-col items-center space-y-2 justify-center"
                >
                    <div>{{ stateMap[type].title }}</div>
                    <div class="text-sm color-stone">
                        {{ stateMap[type].desc }}
                    </div>
                </div>
                <template #image>
                    <div
                        class="flex h-full text-9xl color-green items-center justify-center"
                        :class="['color-' + stateMap[type].color]"
                    >
                        <div :class="stateMap[type].icon"></div>
                    </div>
                </template>
            </van-empty>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
// 页面分为三种状态：success=>验证成功、timeout=>超时、auth=>验证失败
const stateMap = {
    success: {
        title: "驗證成功",
        desc: "驗證已完成",
        icon: "i-tabler:discount-check-filled",
        color: "green",
    },
    timeout: {
        title: "驗證超時",
        desc: "請重新驗證",
        icon: "i-tabler:clock-hour-8",
        color: "orange",
    },
    auth: {
        title: "驗證失敗",
        desc: "拒絕訪問",
        icon: "i-tabler:alert-triangle",
        color: "red",
    },
};
const props = defineProps({
    type: {
        type: String,
        default: "success",
        validator: (val) => {
            const check = ["success", "timeout", "auth"].includes(val);
            if (!check) {
                console.error(
                    `type必须是${["success", "timeout", "auth"].join(
                        ","
                    )}中的一个`
                );
            }
            return check;
        },
    },
});
</script>
