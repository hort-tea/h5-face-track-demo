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
                <div class="w-full mx-auto pt-6">
                    <div class="flex justify-between w-full gap-4">
                        <div
                            class="flex-1"
                            v-if="pageType != 3"
                        >
                            <h4 class="m-0 mb-1 text-center">上傳照片</h4>
                            <van-image
                                :src="croppedImageUrlState"
                                height="212"
                                fit="cover"
                                @click="previewFace(croppedImageUrlState)"
                            />
                        </div>
                        <div
                            class="flex-1"
                            :class="{ 'text-center': pageType == 3 }"
                        >
                            <h4 class="m-0 mb-1 text-center">現場照</h4>
                            <!-- width="100"
                        height="134"
                        fit="cover" -->
                            <van-image
                                :src="xcpic"
                                height="212"
                                fit="cover"
                                @click="previewFace(xcpic)"
                            />
                        </div>
                    </div>
                    <div
                        v-if="!result && loading"
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
                        class="flex justify-center mt-4"
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
                    <!-- 比對值 保留兩位小數 V3接口改造 -->
                    <!-- <div class="w-full text-center mt-4">
                        比對值：{{ result?.percentage?.toFixed(2) }}%
                    </div> -->
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
                <!-- 在這裡顯示錯誤消息 -->
                <div
                    v-if="errorMessage"
                    class="w-3/5 mx-auto mt-6 text-center"
                >
                    <span class="text-red-500">{{ errorMessage }}</span>
                </div>
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
                <!-- 不合格操作 -->
                <div>
                    <div
                        v-if="result?.percentage < 60"
                        class="mt-6"
                    >
                        <van-button
                            type="danger"
                            block
                            @click="resetBaduUrl"
                        >
                            重新驗證
                        </van-button>
                        <div
                            class="mt-2"
                            v-if="pageType != 3"
                        >
                            <van-button
                                type="success"
                                block
                                @click="resetBaduUrl(0)"
                            >
                                重新上傳相片
                            </van-button>
                        </div>
                    </div>
                    <div
                        class="mt-2"
                        v-else
                    >
                        <van-button
                            v-if="result"
                            type="success"
                            block
                            @click="resetBaduUrl(0)"
                        >
                            重新上傳相片
                        </van-button>
                    </div>
                    <div
                        class="mt-2"
                        v-if="result?.percentage"
                    >
                        <van-button
                            type="primary"
                            block
                            @click="navigateTo('/signature', { replace: true })"
                        >
                            下一步簽名
                        </van-button>
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
const faceList = useState<string[]>("face-list", () => []);
const croppedImageUrlState = ref("");
const previewFace = (s: string) => {
    showImagePreview([s]);
};
const loading = ref(false);
const result = ref(null);
const errorMessage = ref("");
const errorStatusDisplay = ref("");
const xcpic = ref(undefined);
const upPic = ref(undefined);
const pageType = ref(localStorage.getItem("pageType") || "");
// 請求接口
const route = useRoute();
const params = JSON.parse(decodeURIComponent(route.query.data));
result.value = params;
if (result.value?.code == 0) {
    errorStatusDisplay.value = "验证失败" || result.value.msg;
    errorMessage.value = "檢測失敗，請重試!" || result.value.msg;
    showToast("验证失败");
    navigateTo("/upload", { replace: true });
} else {
    xcpic.value = params.result?.xcpic_path_bd || "";
    upPic.value = params.result?.photo_path || "";
    result.value = JSON.parse(params.result.similarity.response);
    localStorage.setItem("xcpic_path", params.result?.xcpic_path);
    localStorage.setItem("photo_path", params.result?.photo_path);
}
console.log(params.result);
console.log(result.value);
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
const confirmSignature = async () => {
    loading.value = true;
    const idcard = useState("useStateIdNumber", () => "");
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
    if (!photoPath && localStorage.getItem("pageType") != 3) {
        showToast("缺少 step1 的 photo_path");
        loading.value = false;
        return;
    }
    const log_data = localStorage.getItem("step1Log");
    faceVerifyStep2(file, idcard.value, photoPath, log_data)
        .then((res) => {
            loading.value = false;
            switch (res.code) {
                case 0:
                    errorStatusDisplay.value = "";
                    errorMessage.value = "檢測失敗，請重試!";
                    console.log(errorMessage.value, "errorMessage.value");
                    showToast(errorMessage.value);
                    // navigateTo("/upload", { replace: true });
                    break;
                case 200:
                    result.value = res.result.similarity;
                    try {
                        const payload =
                            (res && res.result && res.result.data) ||
                            res.result ||
                            null;
                        if (payload) {
                            localStorage.setItem(
                                "step2",
                                JSON.stringify(payload)
                            );
                        }
                    } catch (e) {}
                    break;
                default:
                    errorStatusDisplay.value = "檢測失敗，請重試";
                    errorMessage.value = `檢測失敗，請重試`;
                    showToast(errorMessage.value);
                    navigateTo("/upload", { replace: true });
                    break;
            }
        })
        .catch((err) => {
            loading.value = false;
            // 处理错误，例如显示错误信息
            if (err.message === "timeout of 100ms exceeded") {
                errorMessage.value = "請求超時，請重試";
                showToast(errorMessage.value);
                navigateTo("/upload", { replace: true });
                return;
            } else {
                errorStatusDisplay.value = "檢測失敗，請重試";
                errorMessage.value = "檢測失敗，請重試";
                showToast(errorMessage.value);
                navigateTo("/upload", { replace: true });
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
/**
 * 将输入统一转换为纯 base64 字符串（不含 dataURL 前缀）
 * 支持：dataURL、blob:url、http(s) URL、相对路径或已是 base64
 */
const toPureBase64Async = async (data?: string | null): Promise<string> => {
    if (!data) return "";
    // 已是 dataURL：用 canvas 统一转为 JPEG，并返回纯 base64
    if (/^data:image\//i.test(data)) {
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        const width = img.naturalWidth || img.width;
                        const height = img.naturalHeight || img.height;
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) {
                            reject(new Error("Canvas 2D context unavailable"));
                            return;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        const jpegDataUrl = canvas.toDataURL(
                            "image/jpeg",
                            0.92
                        );
                        console.log(jpegDataUrl, "jpegDataUrl");
                        resolve(jpegDataUrl.split(",")[1]);
                    } catch (err) {
                        reject(err as Error);
                    }
                };
                img.onerror = () =>
                    reject(
                        new Error("Failed to load dataURL for JPEG conversion")
                    );
                img.src = data;
            });
            return base64;
        } catch (e) {
            console.error("dataURL 转 JPEG base64 失败:", e);
            return "";
        }
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
            // 使用 canvas 将图片转为 JPG 格式的 base64 DataURL
            const objectUrl = URL.createObjectURL(blob);
            const base64 = await new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        const width = img.naturalWidth || img.width;
                        const height = img.naturalHeight || img.height;
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) {
                            URL.revokeObjectURL(objectUrl);
                            reject(new Error("Canvas 2D context unavailable"));
                            return;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        // 质量 0.92 可按需调整（0-1）
                        const jpegDataUrl = canvas.toDataURL(
                            "image/jpeg",
                            0.92
                        );
                        URL.revokeObjectURL(objectUrl);
                        resolve(jpegDataUrl.split(",")[1]);
                    } catch (err) {
                        URL.revokeObjectURL(objectUrl);
                        reject(err as Error);
                    }
                };
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(
                        new Error("Failed to load image for JPEG conversion")
                    );
                };
                img.src = objectUrl;
            });
            // 返回纯 base64（无 dataURL 前缀）
            return base64;
        } catch (e) {
            console.error("图片转 base64 失败:", e);
            return "";
        }
    }
    // 其他情况：视为已是 base64，去掉可能的起始 '/'
    return data.replace(/^\//, "");
};
const resetBaduUrl = (type: number) => {
    showLoadingToast({
        message: "加載中...",
        forbidClick: true,
        duration: 0,
    });
    const token = localStorage.getItem("token");
    check_token({ token })
        .then((res) => {
            localStorage.setItem("token", res.result.token);
            localStorage.setItem("btoken", res.result.btoken);
            localStorage.setItem("pageType", res.result.type);
            localStorage.setItem("identity", res.result.identity);
            const localtionHref = localStorage.getItem("localtionHref");
            let baidu = undefined;
            let callbackUrl = undefined;

            baidu =
                "https://brain.baidu.com/face/print/detection?token=" +
                res.result.btoken;
            callbackUrl =
                localtionHref +
                "face_similarity/bdface_cb.php?" +
                "bt=" +
                res.result.btoken +
                "&tk=" +
                res.result.token;
            localStorage.setItem("baidu", baidu);
            localStorage.setItem("callbackUrl", callbackUrl);
            if (type == 0) {
                navigateTo("/upload", { replace: true });
            } else {
                if (localStorage.getItem("pageType") == 3) {
                    const baidu = localStorage.getItem("baidu");
                    const callbackUrl = localStorage.getItem("callbackUrl");
                    //跳轉到百度
                    window.location.href =
                        baidu +
                        "&callbackUrl=" +
                        encodeURIComponent(callbackUrl);
                } else {
                    const baidu = localStorage.getItem("baidu");
                    const step1 = localStorage.getItem("step1");
                    const step1Log = localStorage.getItem("step1Log");
                    let callbackUrl = localStorage.getItem("callbackUrl");
                    callbackUrl = `${callbackUrl}&ppath=${
                        JSON.parse(step1)?.path || ""
                    }&l=${encodeURIComponent(step1Log)}`;
                    window.location.href =
                        baidu +
                        "&callbackUrl=" +
                        encodeURIComponent(callbackUrl);
                }
            }
        })
        .catch((err) => {
            showToast(err.details.msg || "驗證失敗");
            setTimeout(() => {
                router.replace({
                    path: "auth",
                    query: {
                        type: "auth",
                    },
                });
                showLoading.value = false;
            }, 1500);
        })
        .finally(() => {
            closeToast();
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
