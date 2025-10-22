<!-- 图片上传内容页面 -->
<template>
    <div>
        <van-nav-bar
            title="图片上传"
            left-text="返回"
            left-arrow
            @click-left="navigateTo('/')"
        />
        <!-- 页面主体 -->
        <div class="p-4 bg-gray-50">
            <div class="bg-white rounded-lg shadow-sm p-4">
                <!-- 输入身份证字号 -->
                <div class="mb-4">
                    <van-field
                        :label-width="50"
                        v-model="idNumber"
                        label="身份证"
                        placeholder="请输入身份证字号"
                        clearable
                        input-align="left"
                    />
                </div>
                <!-- 上传区域（自定义样式 + 使用 Vant Uploader） -->

                <div
                    class="mt-4 flex flex-col items-center justify-center text-center select-none uploader-container"
                >
                    <van-uploader
                        v-model="fileList"
                        :after-read="onAfterRead"
                        :multiple="false"
                        class="w-3/5 mx-auto"
                    >
                        <template #default>
                            <div
                                class="border-2 border-dashed border-blue-300 rounded-md h-56 flex flex-col items-center justify-center text-center select-none"
                            >
                                <div
                                    class="i-tabler:camera text-4xl color-blue-500 mb-2"
                                ></div>
                                <div class="text-gray-600">
                                    点击上传您的相片
                                </div>
                            </div>
                        </template>
                    </van-uploader>
                </div>
                <!-- 说明列表 -->
                <div class="mt-6 space-y-3">
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            1
                        </div>
                        <p class="text-gray-700 my-0">
                            请确认您的相片符合官方规定的证照规范
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            2
                        </div>
                        <p class="text-gray-700 my-0">
                            上传档案大小请确保不超过 2MB 以下
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            3
                        </div>
                        <p class="text-gray-700 my-0">
                            上传后请按照指示将相片移动至指定红线内
                        </p>
                    </div>
                </div>
                <!-- 上传按钮 -->
                <div class="mt-8">
                    <van-button
                        type="primary"
                        block
                        @click="navigateTo('/beforeFace')"
                    >
                        上传
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const idNumber = ref("");
const fileList = ref([]);
const onAfterRead = (file) => {
    // 这里只做布局，不实现具体上传逻辑
    // 可在此接入实际上传或校验大小/类型
};
</script>
<style scoped>
.uploader-container :deep(.van-uploader__input-wrapper) {
    width: 100%;
}
</style>
