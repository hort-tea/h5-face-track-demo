<template>
    <van-nav-bar
        title="驗證結果"
        left-text="返回"
        left-arrow
        @click-left="navigateTo('/beforeFace')"
    />
    <div class="p-4 bg-gray-50">
        <div class="container mx-auto bg-white">
            <div class="box-border px-6">
                <div class="w-3/5 mx-auto pt-12">
                    <van-image
                        :src="croppedImageUrlState"
                        @click="previewFace(croppedImageUrlState)"
                    />
                    <div
                        v-if="!result"
                        class="text-center py-8"
                    >
                        <van-loading
                            type="spinner"
                            color="#1989fa"
                            size="24px"
                        />
                        <div class="mt-2 loading-dots">
                            檢測中
                            <span class="dot dot1">.</span>
                            <span class="dot dot2">.</span>
                            <span class="dot dot3">.</span>
                        </div>
                    </div>
                    <div
                        v-else
                        class="flex justify-center"
                    >
                        <van-tag
                            class="mt-4 p-[13px] font-[lg] font-bold"
                            size="large"
                            type="success"
                            v-if="result?.percentage >= 75"
                        >
                            基本符合
                        </van-tag>
                        <van-tag
                            color="#eab308"
                            class="text-white"
                            v-if="
                                result?.percentage >= 60 &&
                                result?.percentage < 75
                            "
                        >
                            勉強符合
                        </van-tag>
                        <van-tag
                            v-if="result?.percentage < 60"
                            color="#ef4444"
                        >
                            不合格
                        </van-tag>
                    </div>
                </div>
                <template v-if="result">
                    <div
                        class="w-3/5 mx-auto mt-6 text-center"
                        v-if="result?.percentage >= 75"
                    >
                        經檢測
                        <br />
                        <span class="text-green-500">
                            您上傳的相片初步符合規範 請點擊下一步簽名確認
                        </span>
                    </div>
                    <div
                        v-if="
                            result?.percentage >= 60 && result?.percentage < 75
                        "
                        class="w-3/5 mx-auto mt-6 text-center"
                    >
                        經檢測
                        <br />
                        <span class="text-yellow-500">
                            您上傳的相片可能與本人現況不太相符
                            上傳後建議於送件時再次與本公司服務點人員確認
                            請點擊下一步簽名確認
                        </span>
                    </div>
                    <div
                        v-if="result?.percentage < 60"
                        class="w-3/5 mx-auto mt-6 text-center"
                    >
                        經檢測
                        <br />
                        <span class="text-red-500">
                            您上傳的相片與本人差異過大 建議您可至本公司服務櫃台
                            由本公司人員現場協助拍攝制證照
                        </span>
                    </div>
                </template>

                <!-- <van-empty>
                    <div
                        class="flex flex-col items-center space-y-2 justify-center"
                    >
                        <div>
                            您的相片初步符合要求，並將於您簽名確認後上傳至平台
                            後續請攜帶相關材料至本公司受理櫃檯辦理申請。
                            如相片於後續審查不符規範，可由本公司受理櫃檯協助進行重新拍攝符合規範之制證相片
                        </div>
                        <div class="text-sm color-stone">
                            验证已通过，点击签名继续操作
                        </div>
                    </div>
                    <template #image>
                        <div
                            class="flex h-full text-9xl color-green items-center justify-center"
                        >
                            <div class="i-tabler:discount-check-filled"></div>
                        </div>
                    </template>
                </van-empty> -->
                <div
                    class="mt-6"
                    v-if="result?.percentage >= 60"
                >
                    <van-button
                        type="primary"
                        block
                        @click="navigateTo('/signature')"
                    >
                        下一步簽名
                    </van-button>
                </div>
                <div
                    class="mt-6"
                    v-else
                >
                    <van-button
                        type="primary"
                        block
                        @click="navigateTo('/upload', { replace: true })"
                    >
                        重新上傳相片
                    </van-button>
                </div>

                <!-- <div
                    class="flex items-center justify-center my-8"
                    v-if="faceList.length > 0"
                >
                    <div class="my-1">
                        <van-image
                            width="100"
                            height="134"
                            fit="cover"
                            :src="faceList[0]"
                            @click="showImagePreview(faceList, 0)"
                        />
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { faceSimilarityByBase64 } from "@/services/face";

// 人臉數據
const faceList = useState<string[]>("face-list", () => []);
// 提交的數據
const croppedImageUrlState = useState<string>(
    "useStateCroppedImageUrl",
    () => ""
);

// 預覽圖片
const previewFace = (croppedImageUrlState: string) => {
    showImagePreview([croppedImageUrlState]);
};
const loading = ref(false);
const result = ref(null);
// 請求接口
onBeforeMount(() => {
    confirmSignature();
});
const confirmSignature = async () => {
    loading.value = true;
    const img1 = await toPureBase64Async(croppedImageUrlState.value);
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
            // 若返回為空，提示失敗並返回重新上傳
            if (!res) {
                showToast("請重新上傳相片");
                return;
            }
            result.value = res;
        })
        .catch(() => {
            loading.value = false;
        });
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
</script>
<style scoped>
:deep(.van-tag) {
    font-size: 21px;
    padding: 13px;
}

/* 檢測中文案的點點動畫 */
.loading-dots .dot {
    display: inline-block;
    width: 1ch;
    text-align: center;
    opacity: 0;
    animation: blink 1.4s infinite;
}
.loading-dots .dot2 {
    animation-delay: 0.2s;
}
.loading-dots .dot3 {
    animation-delay: 0.4s;
}
@keyframes blink {
    0% {
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
