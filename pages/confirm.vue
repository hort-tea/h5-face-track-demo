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
                <div class="flex-1 max-w-[60%]">
                    <van-image
                        class="border border-gray-300"
                        height="auto"
                        width="100%"
                        fit="contain"
                        :src="croppedImageUrlState"
                        @click="previewCroppedImage(croppedImageUrlState)"
                    />
                </div>
            </div>
            <!-- 台灣身份證號顯示 -->
            <div class="p-4 flex-1 text-center text-sm font-medium">
                台灣身份證號：{{ idNumberState }}
            </div>
            <div class="text-center text-lg font-medium">
                請您再次確認無誤後，本相片將上傳至平台
                並做為您後續申請台胞證的制證相片使用
                如有任何疑問，請洽本公司服務櫃台洽詢。
            </div>
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
                    <div class="relative w-[60%] h-[110px]">
                        <div
                            class="absolute top-1/2 left-1/2 w-full h-full"
                            style="
                                transform: translate(-50%, -50%) rotate(-90deg)
                                    scale(1.6);
                                transform-origin: center;
                            "
                        >
                            <van-image
                                class="w-full h-full border border-gray-300 rounded"
                                fit="contain"
                                :src="currentSignature.imageData"
                            />
                        </div>
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
// 提交的數據
const croppedImageUrlState = useState<string>(
    "useStateCroppedImageUrl",
    () => ""
);
const idNumberState = useState<string>("useStateIdNumber", () => "");
// 当前签名
const currentSignature = ref(null);

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

// 页面加载时获取当前签名和裁切图片
onMounted(() => {
    loadCurrentSignature();
});
const confirmSignature = async () => {
    showConfirmDialog({
        title: "確認提交",
        message: "是否確認提交？",
        confirmButtonText: "確認",
        cancelButtonText: "取消",
    })
        .then(async () => {
            showToast("點擊了確認提交");
            // 确认提交逻辑
        })
        .catch(() => {
            showToast("點擊了取消提交");
            // 取消提交逻辑
        });
};
</script>
