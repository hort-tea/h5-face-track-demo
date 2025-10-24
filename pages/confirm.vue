<template>
    <van-nav-bar
        title="签名确认"
        left-text="返回"
        left-arrow
        @click-left="navigateTo('/signature')"
    ></van-nav-bar>
    <div class="px-4 mt-3 bg-gray-50">
        <div class="bg-white p-4">
            <PhotoStep :active="3" />
            <div class="flex items-center justify-center mb-3">
                <van-image
                    class="border border-gray-300 rounded"
                    width="80%"
                    height="auto"
                    fit="contain"
                    :src="croppedImageUrl"
                    @click="previewCroppedImage"
                />
            </div>
            <!-- 当前签名显示 -->
            <div
                v-if="currentSignature"
                class="border border-gray-200 rounded-lg p-4"
            >
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium">签名时间</span>
                    <span class="text-xs text-gray-500">
                        {{ currentSignature.date }}
                    </span>
                </div>

                <div class="flex items-center justify-center mb-3">
                    <van-image
                        class="border border-gray-300 rounded"
                        width="60%"
                        height="auto"
                        fit="contain"
                        :src="currentSignature.imageData"
                        @click="previewSignature"
                    />
                </div>
            </div>

            <!-- 无签名提示 -->
            <div
                v-else
                class="text-center py-8"
            >
                <p class="text-gray-500 mb-4">暂无保存的签名</p>
                <van-button
                    type="primary"
                    @click="navigateTo('/signature')"
                >
                    去签名
                </van-button>
            </div>

            <!-- 操作按钮 -->
            <div
                v-if="currentSignature"
                class="mt-6 space-y-3"
            >
                <van-button
                    type="primary"
                    block
                    @click="confirmSignature"
                >
                    确认使用此签名
                </van-button>

                <van-button
                    block
                    @click="navigateTo('/signature')"
                >
                    重新签名
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 当前签名
const currentSignature = ref(null);

// 裁切后的图片URL
const croppedImageUrl = ref("");

/**
 * 从本地存储加载裁切后的图片
 */
const loadCroppedImage = () => {
    try {
        const savedCroppedImageUrl = localStorage.getItem("croppedImageUrl");
        if (savedCroppedImageUrl) {
            croppedImageUrl.value = savedCroppedImageUrl;
            console.log("已从本地存储加载裁切后的图片");
        }
    } catch (error) {
        console.error("从本地存储加载裁切图片失败:", error);
    }
};

/**
 * 预览裁切后的图片
 */
const previewCroppedImage = () => {
    const imageUrl = croppedImageUrl.value;
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
            <head><title>图片预览</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5;">
                <img src="${imageUrl}" style="max-width:90%; max-height:90%; border:1px solid #ddd; background:white;" />
            </body>
        </html>
    `);
};

/**
 * 从本地存储加载当前签名
 */
const loadCurrentSignature = () => {
    try {
        const storedList = JSON.parse(
            localStorage.getItem("signature_list") || "[]"
        );

        if (storedList.length > 0) {
            const signatureInfo = storedList[0]; // 只有一个签名
            const imageData = localStorage.getItem(signatureInfo.key);

            if (imageData) {
                currentSignature.value = {
                    ...signatureInfo,
                    imageData: imageData,
                };
                console.log("加载当前签名成功:", signatureInfo.key);
            } else {
                console.log("签名图片数据不存在");
                currentSignature.value = null;
            }
        } else {
            console.log("没有保存的签名");
            currentSignature.value = null;
        }
    } catch (error) {
        console.error("加载签名失败:", error);
        currentSignature.value = null;
    }
};

/**
 * 预览签名
 */
const previewSignature = () => {
    if (currentSignature.value && currentSignature.value.imageData) {
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>签名预览</title></head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5;">
                    <img src="${currentSignature.value.imageData}" style="max-width:90%; max-height:90%; border:1px solid #ddd; background:white;" />
                </body>
            </html>
        `);
    }
};

/**
 * 删除当前签名
 */
const deleteCurrentSignature = () => {
    if (
        confirm(
            `确定要删除这个签名吗？\n保存时间: ${currentSignature.value.date}`
        )
    ) {
        try {
            // 从localStorage删除图片数据
            localStorage.removeItem(currentSignature.value.key);

            // 清空签名列表
            localStorage.removeItem("signature_list");

            // 清空当前签名
            currentSignature.value = null;

            console.log("删除签名成功");
        } catch (error) {
            console.error("删除签名失败:", error);
            alert("删除失败，请重试");
        }
    }
};

/**
 * 确认使用签名
 */
const confirmSignature = () => {
    if (currentSignature.value) {
        console.log("确认使用签名:", currentSignature.value.key);
        // 这里可以添加确认使用签名的逻辑
        // 比如跳转到下一页或者保存到某个地方
    }
};

// 页面加载时获取当前签名和裁切图片
onMounted(() => {
    loadCurrentSignature();
    loadCroppedImage();
});
</script>
