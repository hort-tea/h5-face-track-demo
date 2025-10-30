<template>
    <van-nav-bar
        title="簽名確認"
        left-text="返回"
        left-arrow
        @click-left="navigateTo('/signature')"
    ></van-nav-bar>
    <div class="px-4 mt-3 bg-gray-50">
        <div class="bg-white p-4">
            <PhotoStep :active="3" />
            <div class="flex items-center justify-center mb-3 gap-3">
                <!--  :src="croppedImageUrl" -->
                <div class="flex-1 max-w-[50%]">
                    <van-image
                        class="border border-gray-300 rounded"
                        height="auto"
                        width="100%"
                        fit="contain"
                        :src="croppedImageUrl"
                        @click="previewCroppedImage(croppedImageUrl)"
                    />
                </div>
                <div class="flex-1 max-w-[50%]">
                    <van-image
                        class="border border-gray-300 rounded"
                        height="auto"
                        width="100%"
                        fit="contain"
                        :src="faceList[0]"
                        @click="previewCroppedImage(faceList[0])"
                    />
                </div>
            </div>
            <!-- 比对结果显示 -->
            <template v-if="result">
                <div class="text-center text-lg font-medium">
                    比對結果：
                    <span
                        :class="{
                            'text-green-600': result?.is_match,
                            'text-red-600': !result?.is_match,
                        }"
                    >
                        {{ result?.is_match ? "匹配成功" : "匹配失敗" }}
                    </span>
                </div>
                <div class="text-center text-lg font-medium">
                    相似度：
                    <span class="text-green-600">
                        {{ result?.percentage || 0 }}%
                    </span>
                </div>
            </template>
            <template v-else>
                <div class="text-center text-lg font-medium">
                    請按提交按鈕進行比對
                </div>
            </template>
            <!-- 当前签名显示 -->
            <div
                v-if="currentSignature"
                class="border border-gray-200 rounded-lg p-4"
            >
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium">簽名時間</span>
                    <span class="text-xs text-gray-500">
                        {{ currentSignature.date }}
                    </span>
                </div>
                <div class="flex items-center justify-center">
                    <div
                        class="relative w-[60%] h-[120px]"
                        style="overflow: hidden"
                    >
                        <van-image
                            class="absolute top-1/2 left-1/2 border border-gray-300 rounded"
                            fit="contain"
                            :src="currentSignature.imageData"
                            :style="{
                                transform:
                                    'translate(-50%, -50%) rotate(-90deg) scale(0.8)',
                            }"
                        />
                    </div>
                </div>
            </div>
            <!-- 无签名提示 -->
            <div
                v-else
                class="text-center py-8"
            >
                <p class="text-gray-500 mb-4">暂无保存的簽名</p>
                <van-button
                    type="primary"
                    @click="navigateTo('/signature')"
                >
                    去簽名
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
                    :loading="loading"
                    loading-text="提交中..."
                >
                    確認提交
                </van-button>
                <van-button
                    block
                    @click="navigateTo('/signature')"
                >
                    重新簽名
                </van-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
const faceList = useState<string[]>("face-list", () => []);
import { faceSimilarityByBase64 } from "@/services/face";
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
 * 将输入统一转换为纯 base64 字符串（不含 dataURL 前缀）
 * 支持：dataURL、blob:url、http(s) URL、相对路径或已是 base64
 */
const toPureBase64Async = async (data?: string | null): Promise<string> => {
    if (!data) return "";
    // 已是 dataURL：直接截取逗号后的部分
    if (data.startsWith("data:")) {
        const commaIndex = data.indexOf(",");
        const pure = commaIndex !== -1 ? data.slice(commaIndex + 1) : data;
        return pure;
    }
    // 是 URL 或 blob
    if (
        /^(https?:)/.test(data) ||
        data.startsWith("blob:") ||
        /^[./]/.test(data)
    ) {
        try {
            const res = await fetch(data);
            const blob = await res.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(",")[1]?.replace(/^\//, "") || "");
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            return base64;
        } catch (e) {
            console.error("图片转 base64 失败:", e);
            return "";
        }
    }
    // 其他情况：视为已是 base64，去掉可能的起始 '/'
    return data.replace(/^\//, "");
};
/**
 * 预览裁切后的图片
 */
const previewCroppedImage = (imgUrl: string) => {
    showImagePreview([imgUrl]);
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
 * 确认提交
 */
const result = ref(null);
const loading = ref(false);
const confirmSignature = async () => {
    loading.value = true;
    const img1 = await toPureBase64Async(croppedImageUrl.value);
    const img2 = await toPureBase64Async(faceList.value[0]);
    if (!img2) {
        alert("请先获取人脸");
        loading.value = false;
        return;
    }
    if (!img1) {
        alert("请先裁切并获取图片");
        loading.value = false;
        return;
    }
    faceSimilarityByBase64({ image1: img1, image2: img2 })
        .then((res) => {
            loading.value = false;
            result.value = res;
        })
        .catch(() => {
            loading.value = false;
        });
};
// 页面加载时获取当前签名和裁切图片
onMounted(() => {
    loadCurrentSignature();
    loadCroppedImage();
});
</script>
