<template>
    <van-nav-bar title="驗證結果" left-text="返回" left-arrow @click-left="navigateTo('/upload')" />
    <div class="p-4 bg-gray-50">
        <div class="container mx-auto bg-white">
            <div class="box-border px-6">
                <div class="w-full mx-auto pt-6">
                    <div class="flex justify-between w-full gap-4">
                        <div class="flex-1 text-center" v-if="pageType != 3">
                            <h4 class="m-0 mb-1 text-center">上傳照片</h4>
                            <van-image :src="croppedImageUrlState" height="212" fit="cover" @click="previewFace(croppedImageUrlState)" />
                        </div>
                        <!-- <div
                            class="flex-1"
                            :class="{ 'text-center': pageType == 3 }"
                        >
                            <h4 class="m-0 mb-1 text-center">現場照</h4>
                            <van-image
                                :src="xcpic"
                                height="212"
                                fit="cover"
                                @click="previewFace(xcpic)"
                            />
                        </div> -->
                    </div>
                    <div v-if="!result && loading" class="text-center py-8">
                        <van-loading type="spinner" color="#1989fa" size="24px" />
                        <div class="mt-2 loading-dots">
                            檢測中
                            <span class="dot dot1">.</span>
                            <span class="dot dot2">.</span>
                            <span class="dot dot3">.</span>
                        </div>
                    </div>
                    <div v-else class="flex justify-center mt-4">
                        <van-tag class="mt-4 p-[13px] font-[lg] font-bold" size="large" type="success" v-if="result?.face_match_score > height_score">基本符合</van-tag>
                        <van-tag color="#eab308" class="text-white" v-if="result?.face_match_score >= pass_score && result?.face_match_score <= height_score">勉強符合</van-tag>
                        <van-tag v-if="result?.face_match_score < pass_score" color="#ef4444">不合格</van-tag>
                    </div>
                    <!-- 比對值 保留兩位小數 V3接口改造 -->
                    <!-- <div class="w-full text-center mt-4 text-red-500">
                        比對值：{{ result?.face_match_score?.toFixed(2) }}%
                    </div> -->
                </div>
                <template v-if="result">
                    <div class="w-3/5 mx-auto mt-6 text-center" v-if="result?.face_match_score > height_score">
                        經檢測
                        <br />
                        <span class="text-green-500">您上傳的相片初步符合規範 請點擊下一步簽名確認</span>
                    </div>
                    <div v-if="result?.face_match_score >= pass_score && result?.face_match_score <= height_score" class="w-3/5 mx-auto mt-6 text-center">
                        經檢測
                        <br />
                        <span class="text-yellow-500">您上傳的相片可能與本人現況不太相符 上傳後建議於送件時再次與本公司服務點人員確認 請點擊下一步簽名確認</span>
                    </div>
                    <div v-if="result?.face_match_score < pass_score" class="w-3/5 mx-auto mt-6 text-center">
                        經檢測
                        <br />
                        <span class="text-red-500">您上傳的相片與本人差異過大 建議您可至本公司服務櫃台 由本公司人員現場協助拍攝制證照</span>
                    </div>
                </template>
                <!-- 在這裡顯示錯誤消息 -->
                <div v-if="errorMessage" class="w-3/5 mx-auto mt-6 text-center pb-2">
                    <span class="text-red-500">{{ errorMessage }}</span>
                    <!-- 錯誤返回處理 -->
                    <div class="mt-2">
                        <van-button type="primary" block @click="navigateTo('/idCard', { replace: true })">點擊重測</van-button>
                    </div>
                </div>
                <!-- 不合格操作 -->
                <div>
                    <div v-if="result?.face_match_score < pass_score" class="mt-6">
                        <van-button type="danger" block @click="resetBaduUrl">重新驗證</van-button>
                        <div class="mt-2" v-if="pageType != 3">
                            <van-button type="success" block @click="resetBaduUrl(0)">重新上傳相片</van-button>
                        </div>
                    </div>
                    <div class="mt-2" v-else>
                        <van-button v-if="result" type="success" block @click="resetBaduUrl(0)">重新上傳相片</van-button>
                    </div>
                    <!-- v-if="result?.face_match_score" -->
                    <div class="mt-2" v-if="result?.face_match_score >= pass_score">
                        <van-button type="primary" block @click="navigateTo('/signature', { replace: true })">下一步簽名</van-button>
                    </div>
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
import { faceVerifyStep2 } from "@/services/face";
import { getImage } from "@/composables/idb";
import { check_token } from "@/services/face";
// 分值
const pass_score = ref(localStorage.getItem("pass_score") || 75);
const height_score = ref(localStorage.getItem("height_score") || 90);
const faceList = useState<string[]>("face-list", () => []);
const croppedImageUrlState = ref("");
const previewFace = (s: string) => {
    showImagePreview([s]);
};
const loading = ref(false);
const result = ref(null);
const errorMessage = ref("");
const xcpic = ref(undefined);
const upPic = ref(undefined);
const pageType = ref(localStorage.getItem("pageType") || "");
// 請求接口
const age = Number(localStorage.getItem("age"));
const confirmSignature = async () => {
    loading.value = true;
    const idcard = localStorage.getItem("identity") || "";
    if (!faceList.value.length) {
        const savedFaceList = localStorage.getItem("face-list");
        try {
            faceList.value = savedFaceList ? JSON.parse(savedFaceList) : [];
        } catch (e) {
            faceList.value = [];
        }
    }
    if (!faceList.value.length) {
        showToast("请先获取人脸");
        loading.value = false;
        return;
    }
    const dataUrl = faceList.value[2];
    let blob: Blob | null = null;
    try {
        blob = await (await fetch(dataUrl)).blob();
    } catch (e) {
        blob = null;
    }
    if (!blob) {
        showToast("人脸图片无效");
        loading.value = false;
        return;
    }
    let file: File | Blob = blob;
    try {
        file = new File([blob], "xcpic.jpg", { type: "image/jpeg" });
    } catch (e) {
        showToast("人脸图片转换失败");
        loading.value = false;
        return;
    }
    let photoPath = "";
    try {
        const s = localStorage.getItem("step1");
        const obj = s ? JSON.parse(s) : null;
        photoPath = obj?.photo_path || obj?.path || "";
    } catch (e) {
        photoPath = "";
    }
    if (!photoPath && localStorage.getItem("pageType") != "3") {
        showToast("缺少 step1 的 photo_path");
        loading.value = false;
        return;
    }
    const log_data: string | "" = localStorage.getItem("step1Log") || "";
    faceVerifyStep2(file, idcard, photoPath, log_data)
        .then((res: any) => {
            loading.value = false;
            switch (res.code) {
                case 0:
                    errorMessage.value = "檢測失敗，請重試!";
                    showToast(errorMessage.value);
                    // navigateTo("/upload", { replace: true });
                    break;
                case 200:
                    result.value = res.result;
                    localStorage.setItem("xcpic_path", res.result?.xcpic_path);
                    localStorage.setItem("photo_path", res.result?.photo_path);
                    localStorage.setItem("step2", JSON.stringify(res.result));
                    break;
                default:
                    errorMessage.value = `檢測失敗，請重試`;
                    showToast(errorMessage.value);
                    //navigateTo("/upload", { replace: true });
                    break;
            }
        })
        .catch((err) => {
            console.log(err, "catch");
            loading.value = false;
            // 处理错误，例如显示错误信息
            if (err.message === "timeout of 100ms exceeded") {
                errorMessage.value = "請求超時，請重試";
                showToast(errorMessage.value);
                // navigateTo("/upload", { replace: true });
                return;
            } else {
                errorMessage.value = err.details.msg || "檢測失敗，請重試";
                showToast(errorMessage.value);
                // navigateTo("/upload", { replace: true });
                return;
            }
        })
        .finally(() => {
            // 檢測完成後清空本地存儲與內存中的 face-list
            try {
                //localStorage.removeItem("face-list");
                // faceList.value = [];
            } catch (e) {}
        });
};
if (checkAgeRange(age)) {
    const route = useRoute();
    const params = JSON.parse(decodeURIComponent(route.query.data));
    result.value = params.result;
    try {
        if (result.value?.code == 0) {
            errorMessage.value = "檢測失敗，請重試!" || result.value.msg;
            showToast("验证失败");
            navigateTo("/upload", { replace: true });
        } else if (result.value.error_code > 0) {
            errorMessage.value = "檢測失敗，請重試!" || result.value.msg;
        } else {
            xcpic.value = params.result?.xcpic_path_bd || "";
            upPic.value = params.result?.photo_path || "";
            localStorage.setItem("xcpic_path", params.result?.xcpic_path);
            localStorage.setItem("photo_path", params.result?.photo_path);
            localStorage.setItem("step2", JSON.stringify(params.result));
        }
    } catch (err) {
        errorMessage.value = "檢測失敗，請重試!";
    }
} else {
    // 調取方法
    confirmSignature();
}
onMounted(() => {
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

/**
 * 将输入统一转换为纯 base64 字符串（不含 dataURL 前缀）
 * 支持：dataURL、blob:url、http(s) URL、相对路径或已是 base64
 */
const resetBaduUrl = (type: number) => {
    const age = Number(localStorage.getItem("age") || "");
    // 如果不在年齡區間
    if (!checkAgeRange(age)) {
        if (type == 0) {
            // 重新上傳
            navigateTo("/upload", { replace: true });
        } else {
            // 重新驗證
            navigateTo("/beforeFace", { replace: true });
        }
        return;
    }
    showLoadingToast({
        message: "加載中...",
        forbidClick: true,
        duration: 0,
    });
    const token = localStorage.getItem("token");
    check_token({ token: token || "" })
        .then((res) => {
            closeToast();
            localStorage.setItem("token", res.result.token);
            localStorage.setItem("btoken", res.result.btoken);
            localStorage.setItem("pageType", res.result.type);
            localStorage.setItem("identity", res.result.identity);
            const localtionHref = localStorage.getItem("localtionHref");
            let baidu = undefined;
            let callbackUrl = undefined;

            baidu = "https://brain.baidu.com/face/print/detection?token=" + res.result.btoken;
            callbackUrl = localtionHref + "face_similarity/bdface_cb.php?" + "bt=" + res.result.btoken + "&tk=" + res.result.token;
            localStorage.setItem("baidu", baidu);
            localStorage.setItem("callbackUrl", callbackUrl);
            if (type == 0) {
                navigateTo("/upload", { replace: true });
            } else {
                if (localStorage.getItem("pageType") == 3) {
                    const baidu = localStorage.getItem("baidu");
                    const callbackUrl = localStorage.getItem("callbackUrl");
                    //跳轉到百度
                    window.location.href = baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl);
                } else {
                    const baidu = localStorage.getItem("baidu");
                    const step1 = localStorage.getItem("step1");
                    const step1Log = localStorage.getItem("step1Log");
                    let callbackUrl = localStorage.getItem("callbackUrl");
                    callbackUrl = `${callbackUrl}&ppath=${JSON.parse(step1)?.path || ""}&l=${encodeURIComponent(step1Log)}`;
                    window.location.href = baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl);
                }
            }
        })
        .catch((err) => {
            closeToast();
            showToast({
                message: err?.details?.msg || "驗證失敗",
                duration: 0,
            });

            setTimeout(() => {
                closeToast();
            }, 1500);
        });
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
