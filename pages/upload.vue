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
                        result-type="file"
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
                <!-- 说明 -->
                <div class="mt-4">
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            1
                        </div>
                        <p class="text-gray-700 my-0">
                            請確認您的相片符合6個月內的近期照
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            2
                        </div>
                        <p class="text-gray-700 my-0">
                            上傳檔案大小請確保清晰度並控制在2MB以下
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            3
                        </div>
                        <p class="text-gray-700 my-0">
                            上傳後請按照指示縮放下巴至頭頂範圍至指定紅線內
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

        <!-- 裁剪弹层（Vue Advanced Cropper） -->
        <van-popup
            v-model:show="showCropper"
            position="bottom"
            :style="{ height: '80vh' }"
        >
            <div class="h-full flex flex-col">
                <div class="p-2 border-b flex gap-2 justify-end">
                    <van-button
                        size="small"
                        type="default"
                        @click="resetCrop"
                    >
                        重置
                    </van-button>
                    <van-button
                        size="small"
                        type="primary"
                        @click="confirmCrop"
                    >
                        确认裁剪
                    </van-button>
                    <van-button
                        size="small"
                        type="danger"
                        @click="cancelCrop"
                    >
                        取消
                    </van-button>
                </div>
                <div class="flex-1 overflow-hidden">
                    <Cropper
                        ref="cropperRef"
                        class="vac-cropper"
                        :src="cropImageSrc"
                        :stencil-props="{ aspectRatio: 3 / 4 }"
                        :image-restriction="'stencil'"
                    />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { Cropper } from "vue-advanced-cropper";

const idNumber = ref("");
const fileList = ref([]);

const showCropper = ref(false);
const cropImageSrc = ref("");
const cropperRef = ref(null);

const onAfterRead = (file) => {
    const item = Array.isArray(file) ? file[0] : file;
    let src = "";
    if (item?.file instanceof Blob) {
        src = URL.createObjectURL(item.file);
    } else if (typeof item?.content === "string") {
        src = item.content; // base64 数据
    } else if (typeof item?.url === "string") {
        src = item.url; // 可能存在的预览 URL
    }
    if (!src) {
        console.warn("after-read 未返回有效的 File/Blob 或数据URL");
        return;
    }
    cropImageSrc.value = src;
    showCropper.value = true;
    nextTick(() => {
        // Vue Advanced Cropper 根据 src 自动渲染，无需手动实例化
    });
};

const resetCrop = () => {
    // 重置为当前图片初始状态
    if (cropperRef.value) {
        try {
            cropperRef.value.reset();
        } catch (e) {
            console.warn("reset 不支持，使用 setCoordinates 清零");
            const result = cropperRef.value.getResult();
            if (result?.coordinates) {
                cropperRef.value.setCoordinates({
                    left: 0,
                    top: 0,
                    width: result.coordinates.width,
                    height: result.coordinates.height,
                });
            }
        }
    }
};

const cleanupCropper = () => {
    showCropper.value = false;
    if (cropImageSrc.value && cropImageSrc.value.startsWith("blob:")) {
        URL.revokeObjectURL(cropImageSrc.value);
    }
    cropImageSrc.value = "";
};

const confirmCrop = () => {
    if (!cropperRef.value) return;
    const { canvas } = cropperRef.value.getResult();
    if (!canvas) {
        cleanupCropper();
        return;
    }
    canvas.toBlob(
        (blob) => {
            if (blob) {
                const file = new File([blob], "cropped.jpg", {
                    type: "image/jpeg",
                });
                const url = URL.createObjectURL(blob);
                fileList.value = [{ file, url }];
            }
            cleanupCropper();
        },
        "image/jpeg",
        0.92
    );
};

const cancelCrop = () => {
    cleanupCropper();
};
</script>
<style scoped>
:deep(.van-uploader__input-wrapper) {
    width: 100%;
}
.vac-cropper {
    width: 100%;
    height: 100%;
}
</style>
