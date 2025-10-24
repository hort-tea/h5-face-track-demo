<template>
    <div class="user-card">
        <van-steps :active="active">
            <van-step>照片上传</van-step>
            <van-step>人脸核验</van-step>
            <van-step>签名</van-step>
            <van-step>信息确认</van-step>
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
