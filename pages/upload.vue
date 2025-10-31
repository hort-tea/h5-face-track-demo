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
                >
                    <van-uploader
                        v-model="fileList"
                        :after-read="handleFileUpload"
                        result-type="file"
                        :multiple="false"
                        class="w-3/5 mx-auto"
                    >
                        <template #default>
                            <!-- 如果有裁切后的图片，显示图片 -->
                            <div
                                v-if="croppedImageUrl"
                                class="border-2 border-solid border-green-400 rounded-md h-56 flex items-center justify-center overflow-hidden relative"
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
                        上傳
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
        <!-- <div
            class="cropper-container"
            style="height: 400px; width: 300px"
        >
            <div
                class="h-[75%] border-[1px] border-dashed border-[red] rounded-[50%] w-[78%] cropper-box absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%]"
            ></div>
            <div
                class="h-[65%] w-[68%] border-[1px] border-dashed border-[red] rounded-[50%] cropper-box absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%]"
            ></div>
            <div
                class="w-[32%] h-[8%] border-l-[1px] border-r-[1px] border-l-[red] border-r-[red] border-l-dashed border-r-dashed left-[50%] top-[88%] translate-x-[-50%] translate-y-[-55%] absolute"
            ></div>
            <div
                class="absolute h-[32%] border-l-[1px] border-r-[1px] border-l-[red] border-r-[red] border-l-dashed rotate-[100deg] border-r-dashed top-[80%] left-[120%] translate-x-[-50%] translate-y-[-55%]"
            ></div>
            <div></div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
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

// 监听裁切后的图片URL变化，有值时存储到本地
watch(croppedImageUrl, (newValue) => {
    if (newValue && newValue.trim() !== "") {
        try {
            // vuex 存储裁切後的圖片URL
            const croppedImageUrlState = useState(
                "useStateCroppedImageUrl",
                () => ""
            );
            croppedImageUrlState.value = newValue;
            localStorage.setItem("croppedImageUrl", newValue);
            console.log("裁切后的图片已保存到本地存储");
        } catch (error) {
            console.error("保存裁切图片到本地存储失败:", error);
        }
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
    return (
        validation.isValid &&
        idNumber.value.trim() !== "" &&
        croppedImageUrl.value !== ""
    );
});

// 处理上传按钮点击
const idNumberState = useState("useStateIdNumber", () => "");
const handleUpload = () => {
    // 先验证身份证号码
    const validation = validateIdNumber(idNumber.value);
    if (!validation.isValid) {
        idNumberError.value = true;
        idNumberErrorMessage.value = validation.message;
        return;
    }
    // 验证通过，存储身份证号码到状态管理
    idNumberState.value = idNumber.value;
    // 验证通过，跳转到下一页
    navigateTo("/beforeFace");
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
    if (Croppers.value) {
        const canvas = Croppers.value.getCroppedCanvas();
        canvas.toBlob((blob) => {
            // 处理裁剪后的图片
            const url = URL.createObjectURL(blob);
            console.log("裁剪完成:", url);

            // 将裁切后的图片URL保存到响应式变量中
            croppedImageUrl.value = url;

            // 关闭裁剪弹窗
            showCropper.value = false;
        });
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
