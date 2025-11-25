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
            <PhotoStep :active="0" />
            <div class="bg-white rounded-lg shadow-sm p-4">
                <!-- 输入身份证字号 -->
                <div class="mb-4">
                    <van-field
                        :label-width="50"
                        v-model="idNumber"
                        :border="true"
                        label="身份證"
                        placeholder="請輸入身份證號"
                        clearable
                        input-align="left"
                        :error="idNumberError"
                        :error-message="idNumberErrorMessage"
                        @input="handleIdNumberInput"
                        @blur="handleIdNumberInput"
                    />
                </div>
                <!-- 上传区域（自定义样式 + 使用 Vant Uploader） -->
                <div
                    class="mt-4 flex flex-col items-center justify-center text-center select-none uploader-container"
                    v-if="pageType != 3"
                >
                    <van-uploader
                        v-model="fileList"
                        :after-read="handleFileUpload"
                        result-type="file"
                        :multiple="false"
                        class="w-[201px] mx-auto"
                    >
                        <template #default>
                            <!-- 如果有裁切后的图片，显示图片 -->
                            <div
                                v-if="croppedImageUrl"
                                class="border-2 border-solid border-green-400 rounded-md h-[268px] flex items-center justify-center overflow-hidden relative"
                            >
                                <img
                                    :src="croppedImageUrl"
                                    alt="裁切后的图片"
                                    class="max-w-full max-h-full object-contain"
                                />
                                <div
                                    class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    已裁切
                                </div>
                                <div class="absolute bottom-2 left-2 right-2">
                                    <van-button
                                        size="small"
                                        type="primary"
                                        block
                                        @click="resetImage"
                                    >
                                        重新選擇
                                    </van-button>
                                </div>
                            </div>
                            <!-- 默认上传界面 -->
                            <div
                                v-else
                                class="border-2 border-dashed border-blue-300 rounded-md h-[268px] flex flex-col items-center justify-center text-center select-none"
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

                <div
                    v-if="uploading"
                    class="mt-4"
                >
                    <van-progress
                        :percentage="uploadProgress"
                        pivot-text="上傳中"
                    />
                </div>

                <!-- 说明 -->
                <div
                    class="mt-4"
                    v-if="pageType != 3"
                >
                    <div class="flex items-start mb-2">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            1
                        </div>
                        <p class="text-gray-700 my-0">
                            請確認您的相片符合6個月內的近期照
                        </p>
                    </div>
                    <div class="flex items-start mb-2">
                        <div
                            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2"
                        >
                            2
                        </div>
                        <p class="text-gray-700 my-0">
                            上傳檔案大小請確保清晰度並控制在2MB以下
                        </p>
                    </div>
                    <div class="flex items-start mb-2">
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
                        :disabled="!canUpload"
                        @click="handleUpload"
                    >
                        {{ pageType == 3 ? "下一步" : "上傳" }}
                    </van-button>
                </div>
            </div>
        </div>
        <!-- 裁剪弹层（Cropper.js） -->
        <van-popup
            v-model:show="showCropper"
            position="bottom"
            :style="{ height: '100vh' }"
            :close-on-click-overlay="false"
        >
            <div class="h-full flex flex-col position-relative">
                <div
                    class="text-red-500 bg-white p-2 bg-white tips position-absolute top-2 left-[50%] translate-x-[-50%] z-10 w-[80%]"
                >
                    請使用兩指縮放相片， 並將人頭盡量調整置中並位於框線內
                </div>
                <div
                    class="flex-1 overflow-hidden"
                    style="min-height: 400px"
                >
                    <img
                        ref="cropperWrapRef"
                        :src="imageUrl"
                        class="cropper-wrap"
                        @load="initCropper"
                        style="max-width: 100%; display: block"
                    />
                </div>
                <!-- 缩放比例 -->
                <div
                    class="z-10 bg-white slider-box position-absolute bottom-30 left-[50%] translate-x-[-50%] w-[80%]"
                >
                    <van-slider
                        v-model="zoomRatio"
                        @change="onChangeSlider"
                    />
                </div>
                <div class="p-2 border-b">
                    <div class="flex gap-2 justify-between items-center">
                        <!-- <div class="flex gap-1">
                            <van-button
                                size="mini"
                                :type="
                                    cropperStyle === 'default'
                                        ? 'primary'
                                        : 'default'
                                "
                                @click="changeCropperStyle('default')"
                            >
                                默认
                            </van-button>
                            <van-button
                                size="mini"
                                :type="
                                    cropperStyle === 'elegant'
                                        ? 'primary'
                                        : 'default'
                                "
                                @click="changeCropperStyle('elegant')"
                            >
                                优雅
                            </van-button>
                            <van-button
                                size="mini"
                                :type="
                                    cropperStyle === 'colorful'
                                        ? 'primary'
                                        : 'default'
                                "
                                @click="changeCropperStyle('colorful')"
                            >
                                彩色
                            </van-button>
                        </div> -->
                        <div class="flex gap-2">
                            <van-button
                                size="small"
                                type="default"
                                @click="resetCrop"
                            >
                                重置
                            </van-button>
                            <van-button
                                size="small"
                                type="default"
                                @click="toggleMirror"
                            >
                                鏡像
                            </van-button>
                            <van-button
                                size="small"
                                type="primary"
                                :loading="cropLoading"
                                loading-text="裁剪中..."
                                @click="confirmCrop"
                            >
                                確認裁剪
                            </van-button>
                            <van-button
                                size="small"
                                type="danger"
                                @click="cancelCrop"
                            >
                                取消
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { faceVerifyStep1 } from "@/services/face";
import { ref, nextTick, computed, watch } from "vue";
import { putImage } from "@/composables/idb";
const fileList = ref([]); // 文件列表
const idNumber = ref(""); // 身份证号
const idNumberError = ref(false); // 身份证号错误状态
const idNumberErrorMessage = ref(""); // 身份证号错误信息
const cropperStyle = ref("default"); // 裁切框样式：default, elegant, colorful
const cropperWrapRef = ref(null);
const Croppers = ref(null);
const imageUrl = ref(""); // 图片URL
const croppedImageUrl = ref(""); // 裁切后的图片URL
const showCropper = ref(false); // 控制裁剪弹窗显示
const cropLoading = ref(false); // 裁剪提交时的 loading 状态
const uploading = ref(false);
const uploadProgress = ref(0);
const croppedFile = ref(null);
const pageType = ref(localStorage.getItem("pageType") || "");
// 撤回：移除裁剪提交 loading 状态与淡入就绪逻辑
// 监听裁切后的图片URL变化，有值时存储到本地
watch(croppedImageUrl, async (newValue) => {
    if (newValue && newValue.trim() !== "") {
        try {
            const croppedImageUrlState = useState(
                "useStateCroppedImageUrl",
                () => ""
            );
            croppedImageUrlState.value = newValue;
            const blob = await (await fetch(newValue)).blob();
            const key = `croppedImage-${Date.now()}`;
            await putImage(key, blob);
            localStorage.setItem("croppedImageKey", key);
        } catch (error) {}
    }
});

// 页面加载时从本地存储中恢复裁切后的图片URL
onMounted(() => {
    // try {
    //     const savedCroppedImageUrl = localStorage.getItem("croppedImageUrl");
    //     if (savedCroppedImageUrl) {
    //         croppedImageUrl.value = savedCroppedImageUrl;
    //         console.log("已从本地存储恢复裁切后的图片");
    //     }
    // } catch (error) {
    //     console.error("从本地存储恢复裁切图片失败:", error);
    // }
});

const urlToBase64 = async (input) => {
    if (!input) return "";
    if (typeof input !== "string") {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(input);
        });
        const i = dataUrl.indexOf(",");
        return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
    }
    if (/^data:image\//i.test(input)) {
        const i = input.indexOf(",");
        return i >= 0 ? input.slice(i + 1) : input;
    }
    try {
        const res = await fetch(input);
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(blob);
        });
        const j = dataUrl.indexOf(",");
        return j >= 0 ? dataUrl.slice(j + 1) : dataUrl;
    } catch (e) {
        const dataUrl = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const w = 300;
                const h = 400;
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas 2D context unavailable"));
                    return;
                }
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL("image/jpeg", 0.92));
            };
            img.onerror = reject;
            img.src = input;
        });
        const j = dataUrl.indexOf(",");
        return j >= 0 ? dataUrl.slice(j + 1) : dataUrl;
    }
};

// 身份证号码格式验证函数
// 台湾身份证首字母映射表
const twFirstCode = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    X: 30,
    Y: 31,
    W: 32,
    Z: 33,
    I: 34,
    O: 35,
};

function validateTWCard(id) {
    if (!id) return false;
    const first = id.slice(0, 1);
    const mid = id.slice(1, 9);
    const last = id.slice(9, 10);
    if (!/^[A-Z]$/.test(first)) return false;
    if (!/^\d{8}$/.test(mid)) return false;
    if (!/^\d$/.test(last)) return false;
    const code = twFirstCode[first.toUpperCase()];
    if (typeof code !== "number") return false;
    let sum = Math.floor(code / 10) + (code % 10) * 9;
    let weight = 8;
    for (const ch of mid) {
        sum += Number(ch) * weight;
        weight -= 1;
    }
    const expectedCheck = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return expectedCheck === Number(last);
}

function validateIdCard10(raw) {
    if (!raw) return false;
    const s = String(raw).replace(/[()]/g, "");
    if (!/^[A-Za-z]\d{9}$/.test(s)) return false;
    const genderCode = s.charAt(1);
    if (genderCode !== "1" && genderCode !== "2") return false;
    return validateTWCard(s);
}

const validateIdNumber = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: false, message: "請輸入身份證號" };
    }
    const ok = validateIdCard10(value.trim());
    if (!ok) {
        return { isValid: false, message: "身份證號碼格式錯誤" };
    }
    return { isValid: true, message: "" };
};

// 处理身份证号码输入
const handleIdNumberInput = () => {
    const validation = validateIdNumber(idNumber.value);
    idNumberError.value = !validation.isValid;
    idNumberErrorMessage.value = validation.message;
};

// 计算属性：判断是否可以上传
const canUpload = computed(() => {
    const validation = validateIdNumber(idNumber.value);
    if (pageType.value == 3) {
        return validation.isValid && idNumber.value.trim() !== "";
    } else {
        return (
            validation.isValid &&
            idNumber.value.trim() !== "" &&
            croppedImageUrl.value !== ""
        );
    }
});

// 处理上传按钮点击
const idNumberState = useState("useStateIdNumber", () => "");
const handleUpload = async () => {
    // 先验证身份证号码
    const validation = validateIdNumber(idNumber.value);
    if (!validation.isValid) {
        idNumberError.value = true;
        idNumberErrorMessage.value = validation.message;
        return;
    }

    // 验证通过，存储身份证号码到状态管理
    idNumberState.value = idNumber.value;
    if (!croppedFile.value && localStorage.getItem("pageType") != 3) {
        showToast("請先選擇相片");
        return;
    }
    uploading.value = localStorage.getItem("pageType") == 3 ? false : true;
    uploadProgress.value = 0;
    if (localStorage.getItem("pageType") == 3) {
        if (localStorage.getItem("identity") != idNumber.value) {
            showToast("验证失败：身份证号不一致");
            return;
        } else {
            const baidu = localStorage.getItem("baidu");
            const callbackUrl = localStorage.getItem("callbackUrl");
            //跳轉到百度
            window.location.href =
                baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl);
            // navigateTo("/beforeFace");
        }
    } else {
        try {
            const payloadFile = croppedFile.value;
            console.log(payloadFile, "payloadFile");
            if (!payloadFile && localStorage.getItem("pageType") != 3) {
                showToast("裁切文件無法讀取");
                return;
            }
            const res = await faceVerifyStep1(payloadFile, idNumber.value, {
                onUploadProgress: (e) => {
                    if (e.total) {
                        uploadProgress.value = Math.round(
                            (e.loaded / e.total) * 100
                        );
                    }
                },
            });
            // 在本地存储 faceVerifyStep1中 result的响应
            localStorage.setItem("step1", JSON.stringify(res.result.data));
            localStorage.setItem("step1Log", JSON.stringify(res.log_data));
            // navigateTo("/beforeFace");
            const baidu = localStorage.getItem("baidu");
            let callbackUrl = localStorage.getItem("callbackUrl");
            callbackUrl = `${callbackUrl}&ppath=${
                res.result.data?.path || ""
            }&l=${encodeURIComponent(JSON.stringify(res.log_data))}`;
            window.location.href =
                baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl);
            console.log(
                baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl)
            );
            console.log(baidu + encodeURIComponent(callbackUrl));
            // debugger;
        } catch (e) {
            console.log(e, "e");
            showToast(e.details.msg || "上傳失敗");
        } finally {
            uploading.value = false;
        }
    }
};

// 处理文件上传
const handleFileUpload = (file) => {
    console.log("上传的文件:", file); // 调试用
    // Vant Uploader 传递的是一个包含 file 属性的对象
    const actualFile = file.file || file;
    if (actualFile && actualFile instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target.result;
            showCropper.value = true;
        };
        reader.readAsDataURL(actualFile);
    } else {
        console.error("无效的文件对象:", file);
    }
};

// 图片加载完成后初始化 Cropper
const initCropper = async () => {
    await nextTick();
    if (cropperWrapRef.value) {
        try {
            // 动态导入 Cropper.js
            const { default: Cropper } = await import("cropperjs");
            // 如果已有实例，先销毁
            if (Croppers.value) {
                Croppers.value.destroy();
            }
            Croppers.value = new Cropper(cropperWrapRef.value, {
                aspectRatio: 3 / 4, // 证件照比例
                viewMode: 1, // 限制裁剪框在画布内
                dragMode: "move", // 拖拽模式
                autoCropArea: 0.8, // 自动裁剪区域大小
                responsive: true, // 响应式
                zoomOnWheel: true, // 鼠标滚轮缩放
                zoomOnTouch: true, // 触摸缩放（移动端手势）
                cropBoxMovable: true, // 裁剪框可移动
                cropBoxResizable: true, // 裁剪框可调整大小
                background: true, // 显示网格背景
                guides: true, // 显示辅助线
                center: true, // 显示中心指示器
                highlight: true, // 高亮裁剪区域
                toggleDragModeOnDblclick: false, // 禁用双击切换拖拽模式
                minCropBoxWidth: 100, // 最小裁剪框宽度
                minCropBoxHeight: 100, // 最小裁剪框高度
                // 自定义样式类名
                cropBoxClass: "custom-crop-box",
                // 事件回调
                ready() {
                    console.log("Cropper 准备就绪");
                    // 在 Cropper 完全构建后追加覆盖图
                    appendOverlayToCropBox();
                    // 記錄圖片的初始縮放比，使滑桿 50 對應初始縮放
                    const imgData = Croppers.value.getImageData();
                    if (imgData && imgData.naturalWidth) {
                        initialZoom.value =
                            imgData.width / imgData.naturalWidth;
                    } else {
                        initialZoom.value = 1;
                    }
                    // 將滑桿設置為 50（與初始縮放一致）
                    zoomRatio.value = 50;
                    // 标记就绪，触发淡入显示
                },
                cropstart() {
                    console.log("开始裁剪");
                },
                cropmove() {
                    // console.log('裁剪移动中');
                },
                cropend() {
                    console.log("裁剪结束");
                },
            });
            console.log("Cropper 初始化成功");
        } catch (error) {
            console.error("Cropper 初始化失败:", error);
        }
    }
};

// 重置裁剪
const resetCrop = () => {
    if (Croppers.value) {
        Croppers.value.reset();
    }
};

// 镜像翻转
const toggleMirror = () => {
    if (Croppers.value) {
        const scaleX = Croppers.value.getData().scaleX || 1;
        Croppers.value.scaleX(-scaleX);
    }
};
// 确认裁剪
const confirmCrop = () => {
    if (!Croppers.value) return;
    cropLoading.value = true;
    try {
        const canvas = Croppers.value.getCroppedCanvas();
        canvas.toBlob(
            async (blob) => {
                let b = blob;
                if (!b || !b.type || !/image\/jpeg/i.test(b.type)) {
                    try {
                        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
                        b = await (await fetch(dataUrl)).blob();
                    } catch (e) {}
                }
                if (!b) {
                    cropLoading.value = false;
                    return;
                }
                const url = URL.createObjectURL(b);
                croppedImageUrl.value = url;
                try {
                    const f = new File([b], "cropped.jpg", {
                        type: "image/jpeg",
                    });
                    croppedFile.value = f;
                } catch (e) {
                    croppedFile.value = null;
                }
                showCropper.value = false;
                cropLoading.value = false;
            },
            "image/jpeg",
            0.92
        );
    } catch (e) {
        console.error("确认裁剪失败", e);
        cropLoading.value = false;
    }
};

// 取消裁剪
const cancelCrop = () => {
    showCropper.value = false;
    if (Croppers.value) {
        Croppers.value.destroy();
        Croppers.value = null;
    }
    // 清空图片相关数据
    imageUrl.value = "";
    fileList.value = [];
};

// 重新选择图片
const resetImage = () => {
    // 清空所有图片相关数据
    croppedImageUrl.value = "";
    imageUrl.value = "";
    fileList.value = [];

    // 如果有正在进行的裁剪，也清理掉
    if (Croppers.value) {
        Croppers.value.destroy();
        Croppers.value = null;
    }
    showCropper.value = false;
};

// 切换裁切框样式
const changeCropperStyle = (style) => {
    cropperStyle.value = style;

    if (Croppers.value) {
        // 获取当前裁剪框的容器
        const container = Croppers.value.getContainerData();
        const cropperContainer = document.querySelector(".cropper-container");

        if (cropperContainer) {
            // 移除所有样式类
            cropperContainer.classList.remove(
                "style-default",
                "style-elegant",
                "style-colorful"
            );
            // 添加新的样式类
            cropperContainer.classList.add(`style-${style}`);
        }
    }
};
// showCropper 监听弹窗变化，为裁切框添加一个参考样式
// 追加覆盖图到裁剪框（在 Cropper ready 时机）
function appendOverlayToCropBox() {
    const cropBox = document.querySelector(".cropper-crop-box");
    if (!cropBox) return;
    // 避免重复追加
    if (cropBox.querySelector('img[data-overlay="ckx"]')) return;
    const overlay = document.createElement("img");
    overlay.setAttribute("data-overlay", "ckx");
    overlay.src = "/faces/image/ckx.png"; // 修正为实际存在的资源
    overlay.style.position = "absolute";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "100000";
    overlay.style.pointerEvents = "none"; // 防止遮挡交互
    cropBox.appendChild(overlay);
}
// 裁切比例滑桿值（0-100），50 代表初始縮放
const zoomRatio = ref(50);
// 記錄 Cropper 初始化後的實際縮放比（相對原始圖）
const initialZoom = ref(1);
// 缩放比例变化时触发：將滑桿值映射為基於初始縮放的倍率
const onChangeSlider = (val) => {
    if (Croppers.value) {
        // 使 50 對應 initialZoom；向右放大、向左縮小
        const ratio = initialZoom.value * (val / 50);
        // 避免比例為 0
        const safeRatio = Math.max(ratio, 0.05);
        Croppers.value.zoomTo(safeRatio);
    }
};
</script>
<style scoped>
:deep(.van-uploader__input-wrapper) {
    width: 100%;
}

/* 防止 iOS Safari 因输入框字体过小触发页面缩放 */
:deep(input),
:deep(.van-field__control) {
    font-size: 16px;
}

/* 自定义裁切框样式 */
:deep(.cropper-container) {
    background-color: rgba(0, 0, 0, 0.8);
}

/* 裁剪框边框样式 */
:deep(.cropper-crop-box) {
    border: 2px solid #007aff !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* 裁剪框内部高亮区域 */
:deep(.cropper-view-box) {
    outline: 1px solid rgba(0, 122, 255, 0.75);
    outline-color: rgba(0, 122, 255, 0.75);
}

/* 辅助线样式 - 隐藏虚线 */
:deep(.cropper-dashed) {
    border: none !important;
}

/* 中心点样式 */
:deep(.cropper-center) {
    background-color: #007aff;
    opacity: 0.8;
    width: 8px !important;
    height: 8px !important;
    border-radius: 50%;
    border: 2px solid #fff;
}

/* 调整手柄样式 */
:deep(.cropper-point) {
    background-color: #007aff;
    border: 2px solid #fff;
    border-radius: 50%;
    opacity: 0.8;
    width: 12px !important;
    height: 12px !important;
}

/* 角落调整手柄 */
:deep(.cropper-point.point-nw),
:deep(.cropper-point.point-ne),
:deep(.cropper-point.point-sw),
:deep(.cropper-point.point-se) {
    background-color: #ff3b30;
    width: 14px !important;
    height: 14px !important;
}

/* 边缘调整手柄 */
:deep(.cropper-point.point-n),
:deep(.cropper-point.point-s) {
    background-color: #34c759;
    width: 12px !important;
    height: 8px !important;
    border-radius: 4px;
}

:deep(.cropper-point.point-e),
:deep(.cropper-point.point-w) {
    background-color: #34c759;
    width: 8px !important;
    height: 12px !important;
    border-radius: 4px;
}

/* 裁剪框移动时的样式 */
:deep(.cropper-crop-box:hover) {
    border-color: #ff9500 !important;
    box-shadow: 0 0 0 1px rgba(255, 149, 0, 0.5);
}

/* 网格背景样式 */
:deep(.cropper-bg) {
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255, 255, 255, 0.05) 10px,
        rgba(255, 255, 255, 0.05) 20px
    );
}

/* 裁剪框外部遮罩 */
:deep(.cropper-modal) {
    background-color: rgba(0, 0, 0, 0.6);
}

/* 自定义裁剪框类 */
:deep(.custom-crop-box) {
    border: 3px solid #007aff !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5),
        0 0 20px rgba(0, 122, 255, 0.3);
}

/* 优雅主题样式 */
:deep(.style-elegant .cropper-crop-box) {
    border: 2px solid #d4af37 !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8),
        0 0 15px rgba(212, 175, 55, 0.4);
}

:deep(.style-elegant .cropper-point) {
    background-color: #d4af37;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.style-elegant .cropper-dashed) {
    border: none !important;
}

:deep(.style-elegant .cropper-center) {
    background-color: #d4af37;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.style-elegant .cropper-modal) {
    background-color: rgba(0, 0, 0, 0.7);
}

/* 彩色主题样式 */
:deep(.style-colorful .cropper-crop-box) {
    border: 3px solid #ff6b6b !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9),
        0 0 20px rgba(255, 107, 107, 0.5);
    background: linear-gradient(
        45deg,
        rgba(255, 107, 107, 0.1) 0%,
        rgba(74, 144, 226, 0.1) 50%,
        rgba(80, 227, 194, 0.1) 100%
    );
}

:deep(.style-colorful .cropper-point.point-nw) {
    background-color: #ff6b6b;
}
:deep(.style-colorful .cropper-point.point-ne) {
    background-color: #4ecdc4;
}
:deep(.style-colorful .cropper-point.point-sw) {
    background-color: #45b7d1;
}
:deep(.style-colorful .cropper-point.point-se) {
    background-color: #96ceb4;
}
:deep(.style-colorful .cropper-point.point-n) {
    background-color: #ffeaa7;
}
:deep(.style-colorful .cropper-point.point-s) {
    background-color: #fab1a0;
}
:deep(.style-colorful .cropper-point.point-e) {
    background-color: #fd79a8;
}
:deep(.style-colorful .cropper-point.point-w) {
    background-color: #a29bfe;
}

:deep(.style-colorful .cropper-dashed) {
    border: none !important;
}

:deep(.style-colorful .cropper-center) {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    border: 2px solid #fff;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

:deep(.style-colorful .cropper-modal) {
    background: radial-gradient(
        circle at center,
        rgba(255, 107, 107, 0.3) 0%,
        rgba(0, 0, 0, 0.8) 70%
    );
}
:deep(#van-field-1-input) {
    border-bottom: 1px solid #c4c4c4;
}
:deep(.van-uploader__preview) {
    display: none;
}
</style>
