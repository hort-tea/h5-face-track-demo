<template>
    <div class="user-card">
        <van-steps :active="active">
            <van-step>照片上傳</van-step>
            <van-step>人臉核驗</van-step>
            <van-step>簽名</van-step>
            <van-step>確認提交</van-step>
        </van-steps>
    </div>
</template>
<script setup>
// 定义组件的props
const props = defineProps({
    active: {
        type: Number,
        default: 0,
    },
});
</script>

<style scoped></style>
