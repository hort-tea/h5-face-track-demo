<template>
    <van-nav-bar title="簽名確認" left-text="返回" left-arrow @click-left="navigateTo('/signature')"></van-nav-bar>
    <div class="px-4 mt-3 bg-gray-50">
        <div class="bg-white p-4">
            <PhotoStep :active="3" />
            <div class="flex items-center justify-center mb-3 gap-3" v-if="pageType != '3'">
                <!--  :src="croppedImageUrl" -->
                <div class="flex-1 max-w-[60%]">
                    <van-image class="border border-gray-300" height="auto" width="100%" fit="contain" :src="croppedImageUrlState" @click="previewCroppedImage(croppedImageUrlState)" />
                </div>
            </div>
            <!-- 台灣身份證號顯示 -->
            <div class="p-4 flex-1 text-center text-sm font-medium">台灣身份證號：{{ idcard }}</div>
            <div class="text-center text-lg font-medium">請您再次確認無誤後，本相片將上傳至平台 並做為您後續申請台胞證的制證相片使用 如有任何疑問，請洽本公司服務櫃台洽詢。</div>
            <!-- 当前签名显示 -->
            <div v-if="currentSignature" class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium">簽名時間</span>
                    <span class="text-xs text-gray-500">
                        {{ currentSignature.date }}
                    </span>
                </div>
                <div class="flex items-center justify-center">
                    <div class="relative w-[60%] h-[110px]">
                        <div class="w-full h-full">
                            <van-image class="w-full h-full border border-gray-300 rounded" fit="contain" :src="currentSignature.imageData" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 无签名提示 -->
            <div v-else class="text-center py-8">
                <p class="text-gray-500 mb-4">暂无保存的簽名</p>
                <van-button type="primary" @click="navigateTo('/signature')">去簽名</van-button>
            </div>
            <!-- 操作按钮 -->
            <div v-if="currentSignature" class="mt-6 space-y-3">
                <van-button type="primary" block @click="confirmSignature" loading-text="提交中...">確認提交</van-button>
                <van-button block @click="navigateTo('/signature')">重新簽名</van-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { faceVerifyStep3 } from "@/services/face";
import { getImage } from "@/composables/idb";
const croppedImageUrlState = ref("");
// 当前签名
const currentSignature = ref(null);
const pageType = ref(localStorage.getItem("pageType") || "");
/**
 * 预览裁切后的图片
 */
const previewCroppedImage = (imgUrl: string) => {
    showImagePreview([imgUrl]);
};
const dataUrlToBlob = (s: string): Blob | null => {
    try {
        if (!s) return null;
        if (/^data:/.test(s)) {
            const parts = s.split(",");
            const meta = parts[0] || "";
            const b64 = parts[1] || "";
            const mimeMatch = meta.match(/^data:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
            const bin = atob(b64);
            const len = bin.length;
            const u8 = new Uint8Array(len);
            for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
            return new Blob([u8], { type: mime });
        }
        const bin = atob(s);
        const len = bin.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
        return new Blob([u8], { type: "image/jpeg" });
    } catch {
        return null;
    }
};
/**
 * 从本地存储加载当前签名
 */
const loadCurrentSignature = () => {
    try {
        const storedList = JSON.parse(localStorage.getItem("signature_list") || "[]");
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
    const key = localStorage.getItem("croppedImageKey") || "";
    if (key) {
        getImage(key)
            .then((blob) => {
                if (blob) {
                    croppedImageUrlState.value = URL.createObjectURL(blob);
                } else {
                    const b64 = localStorage.getItem("croppedImageUrl") || "";
                    croppedImageUrlState.value = b64;
                }
            })
            .catch(() => {
                const b64 = localStorage.getItem("croppedImageUrl") || "";
                croppedImageUrlState.value = b64;
            });
    } else {
        const b64 = localStorage.getItem("croppedImageUrl") || "";
        croppedImageUrlState.value = b64;
    }
});
const idcard = localStorage.getItem("identity") || "";
const confirmSignature = async () => {
    showConfirmDialog({
        title: "確認提交",
        message: "是否確認提交？",
        confirmButtonText: "確認",
        cancelButtonText: "取消",
    })
        .then(async () => {
            console.log("确认提交");
            try {
                let signDataUrl = localStorage.getItem("current_signature") || "";
                if (!signDataUrl && currentSignature.value?.imageData) {
                    signDataUrl = String(currentSignature.value.imageData);
                }
                if (!signDataUrl) {
                    showToast("缺少簽名信息");
                    return;
                }
                let signBlob: Blob | null = null;
                try {
                    signBlob = dataUrlToBlob(signDataUrl);
                    if (!signBlob) {
                        signBlob = await (await fetch(signDataUrl)).blob();
                    }
                } catch (e) {
                    signBlob = null;
                }
                if (!signBlob) {
                    showToast("簽名圖片無效");
                    return;
                }
                let signFile: File | Blob = signBlob;
                try {
                    signFile = new File([signBlob], "sign.png", {
                        type: "image/png",
                    });
                } catch (e) {
                    console.log(e, "簽名圖片轉檔失敗");
                    signFile = signBlob;
                }
                let photoPath = localStorage.getItem("photo_path") || "";
                let xcpicPath = localStorage.getItem("xcpic_path") || "";
                const step2 = localStorage.getItem("step2");
                let faceScore = JSON.parse(step2)?.face_match_score.toFixed(2) || 0;
                if ((!photoPath && localStorage.getItem("pageType") != 3) || !xcpicPath) {
                    showToast("缺少上一步的 path");
                    return;
                }
                console.log(signFile, idcard, faceScore, photoPath, xcpicPath);
                const res = await faceVerifyStep3(signFile, idcard, faceScore, photoPath, xcpicPath);
                console.log(res.code, "提交結果");
                switch (res.code) {
                    case 200:
                        showToast(res.msg || "提交成功");
                        setTimeout(() => {
                            navigateTo("/success", { replace: true });
                        }, 1500);
                        break;
                    default:
                        showToast(res.msg || "提交失敗");
                        break;
                }
            } catch (e) {
                console.log(e, "提交過程出錯");
                showToast(e.details.msg || "提交過程出錯");
            }
        })
        .catch(() => {
            showToast("點擊了取消提交");
            // 取消提交逻辑
        });
};
</script>
