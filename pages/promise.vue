<template>
    <van-nav-bar title="情況說明書" left-text="返回" left-arrow />
    <div class="px-4 mt-4">
        <van-image @click="showPreview" :src="previewImage" />
        <span class="text-lg text-red-500 text-center block mt-2">點擊圖片查看</span>
        <div class="mt-6">
            <van-button type="primary" block @click="handleSubmit" :disabled="time >= 0">
                <div class="flex items-center justify-center">
                    確認同意
                    <van-count-down v-if="time >= 0" :time="time" format="ss:SSS" @finish="timeFinish">
                        <template #default="{ seconds }">
                            <span class="text-white">({{ seconds }} 秒)</span>
                        </template>
                    </van-count-down>
                </div>
            </van-button>
        </div>
    </div>
</template>
<script setup lang="ts">
const previewImage = ref("https://img1.baidu.com/it/u=3004443426,3476263770&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=658");
const time = ref(10 * 1000);
const handleSubmit = () => {
    showToast("送出成功");
};
const showPreview = () => {
    showImagePreview([previewImage.value]);
};
const timeFinish = () => {
    time.value = -1;
};
</script>
<style scoped lang="scss"></style>
