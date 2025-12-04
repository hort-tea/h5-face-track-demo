<template>
    <!-- 横屏遮罩提示：检测到横屏时显示，提示开启方向锁定并切回竖屏 -->
    <van-overlay :show="showOrientationMask && !orientationSupported" :z-index="9998" class="orientation-overlay">
        <div class="orientation-content">
            <div class="phone-icon"></div>
            <div class="tip-text">當前為橫屏，請豎屏後開啟系統方向鎖定後再橫屏</div>
        </div>
    </van-overlay>
    <!-- 用于屏幕未旋转时的样式 -->
    <div
        v-if="!isRotate"
        class="box-border bg-white fixed top-0 left-0 flex flex-col"
        id="page-container"
        ref="pageContainerRef"
        :style="{
            width: screenHeight + 'px',
            height: screenWidth + 'px',
            // 固定為竖屏視覺（容器旋轉 90°）以獲得更寬的簽名區域
            transform: `rotate(90deg)`,
            transformOrigin: `center center`,
            left: `${rotateLeftNum}px`,
            top: `${rotateRightNum}px`,
        }"
    >
        <van-nav-bar title="" left-text="申請人簽名(註:未成年請簽監護人姓名)" right-text="" left-arrow @click-left="goBackTwo">
            <template #right>
                <div class="flex gap-2 items-center px-4">
                    <van-button size="small" type="warning" plain @click="canvasClear">重簽</van-button>
                    <van-button size="small" type="primary" @click="saveAsImg">確定</van-button>
                </div>
            </template>
        </van-nav-bar>
        <div class="sign-canvas-plus">
            <SignCanvasPlus
                class="sign-canvas"
                ref="SignCanvasPlusRef"
                :options="options"
                v-model="data"
                :style="{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center center',
                    // 保证 CSS 尺寸与内部 canvas 尺寸一致，避免坐标换算误差
                    width: `${screenWidth - 120}px`,
                    height: `${screenHeight - 200}px`,
                    boxSizing: 'content-box',
                    borderRadius: '20px',
                    border: '2px dashed #ccc',
                    background: '#f9f9f9 !important',
                }"
            ></SignCanvasPlus>
            <!-- 居中背景提示文字 -->
            <div class="sign-overlay-text" v-show="showOverlay">
                <div class="overlay-inner">
                    <div v-if="computedAge" class="text-lg">未成年請簽監護人姓名</div>
                    <div>請在此區域內簽名</div>
                    <div>中文正楷簽名</div>
                </div>
            </div>
        </div>

        <!-- <h3>Vue & Vue3 Sign Canvas 电子签名板</h3> -->

        <!-- <div class="control">
            <ul>
                <li>
                    <label>
                        书写速度:
                        <select
                            name="isSign"
                            v-model="options.isSign"
                        >
                            <option :value="true">签名</option>
                            <option :value="false">写字</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        显示边框/网格:
                        <select
                            name="isSign"
                            v-model="options.isShowBorder"
                        >
                            <option :value="true">显示</option>
                            <option :value="false">不显示</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        兼容高分屏高清绘制:
                        <select
                            name="isSign"
                            v-model="options.isDpr"
                        >
                            <option :value="true">启用</option>
                            <option :value="false">关闭</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        边框宽度:
                        <input
                            v-model="options.borderWidth"
                            type="number"
                        />
                    </label>
                </li>
                <li>
                    <label>
                        下笔宽度:
                        <input
                            v-model="options.writeWidth"
                            type="number"
                        />
                    </label>
                </li>
                <li>
                    <label>
                        图片类型:
                        <select
                            name="imgType"
                            v-model="options.imgType"
                        >
                            <option value="png">png</option>
                            <option value="jpeg">jpeg</option>
                            <option value="webp">webp</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        线条的边缘类型:
                        <select
                            name="lineCap"
                            v-model="options.lineCap"
                        >
                            <option value="butt">平直的边缘</option>
                            <option value="round">圆形线帽</option>
                            <option value="square">正方形线帽</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        线条交汇时边角的类型:
                        <select
                            name="lineCap"
                            v-model="options.lineJoin"
                        >
                            <option value="bevel">创建斜角</option>
                            <option value="round">创建圆角</option>
                            <option value="miter">创建尖角</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label>
                        画笔颜色:
                        <input
                            type="color"
                            v-model="options.writeColor"
                        />
                    </label>
                </li>
                <li>
                    <label>
                        背景色:
                        <input
                            type="color"
                            v-model="options.bgColor"
                        />
                    </label>
                </li>
            </ul>
        </div> -->
    </div>
    <!-- 用于屏幕旋转时的样式 -->
    <div v-else>
        <van-nav-bar title="" left-text="申請人簽名(註:未成年請簽監護人姓名)" right-text="" left-arrow @click-left="goBackTwo">
            <template #right>
                <div class="flex gap-2 items-center px-4">
                    <van-button size="small" type="warning" plain @click="canvasClear">重簽</van-button>
                    <van-button size="small" type="primary" @click="saveAsImg">確定</van-button>
                </div>
            </template>
        </van-nav-bar>
        <div class="sign-canvas-plus sign-canvas-plus2">
            <SignCanvasPlus
                class="sign-canvas"
                ref="SignCanvasPlusRef"
                :options="options"
                v-model="data"
                :style="{
                    // 保证 CSS 尺寸与内部 canvas 尺寸一致，避免坐标换算误差
                    width: `${screenWidth - 200}px`,
                    height: `${screenHeight - 120}px`,
                    boxSizing: 'content-box',
                    borderRadius: '20px',
                    border: '2px dashed #ccc',
                    background: '#f9f9f9 !important',
                }"
            ></SignCanvasPlus>
            <div class="sign-overlay-text" v-show="showOverlay">
                <div class="overlay-inner">
                    <span v-if="computedAge" class="text-lg">未成年請簽監護人姓名</span>
                    <div>請在此區域內簽名</div>
                    <div>中文正楷簽名</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import SignCanvasPlus, { IOptions } from "sign-canvas-plus";
const age = ref(localStorage.getItem("age") || "");
const computedAge = computed(() => age.value < 16);
const router = useRouter();
const goBackTwo = () => {
    router.go(-1);
};
const screenWidth = ref<number>(0);
const screenHeight = ref<number>(0);
const options = ref<IOptions>({});
const metaViewportRef = ref<HTMLMetaElement | null>(null);
// 横屏遮罩显隐
const showOrientationMask = ref(false);
const orientationSupported = ref(false);
// 是否旋转
const isRotate = ref(false);
let orientationMql: MediaQueryList | null = null;
let orientationChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;
let resizeHandler: (() => void) | null = null;
let windowOrientationHandler: (() => void) | null = null;
onMounted(() => {
    // 获取屏幕宽度和高度
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    isRotate.value = window.innerWidth > window.innerHeight;
    renderOptions();
    // 動態插入 viewport meta
    const existing = Array.from(document.head.querySelectorAll('meta[name="viewport"]')).find((m) => (m.getAttribute("content") || "").includes("orientation=portrait"));
    if (existing) {
        metaViewportRef.value = existing as HTMLMetaElement;
    } else {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "viewport");
        meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, orientation=portrait");
        document.head.appendChild(meta);
        metaViewportRef.value = meta;
    }
    const initOrientationWatch = () => {
        try {
            orientationSupported.value = "orientation" in screen && screen.orientation !== null;
            orientationMql = window.matchMedia("(orientation: landscape)");
            const apply = (matches: boolean) => {
                showOrientationMask.value = matches;
                isRotate.value = matches;
                onOrientationUpdated();
                rotateEventId.value++;
            };
            apply(orientationMql.matches);
            orientationChangeHandler = (e: MediaQueryListEvent) => {
                apply(e.matches);
                onOrientationUpdated();
            };
            // @ts-ignore
            if (orientationMql.addListener) {
                orientationMql.addListener(orientationChangeHandler);
            } else if (orientationMql.addEventListener) {
                orientationMql.addEventListener("change", orientationChangeHandler);
            }

            // 作为兜底，监听窗口尺寸变化
            resizeHandler = () => {
                const isLandscape = window.innerWidth > window.innerHeight;
                showOrientationMask.value = isLandscape;
                isRotate.value = isLandscape;
                onOrientationUpdated();
                rotateEventId.value++;
            };
            window.addEventListener("resize", resizeHandler, { passive: true });
            windowOrientationHandler = () => {
                const isLandscape = window.innerWidth > window.innerHeight;
                showOrientationMask.value = isLandscape;
                isRotate.value = isLandscape;
                onOrientationUpdated();
                rotateEventId.value++;
            };
            window.addEventListener("orientationchange", windowOrientationHandler, { passive: true });
        } catch (err) {
            const landscapeInit = window.innerWidth > window.innerHeight;
            showOrientationMask.value = landscapeInit;
            const fallbackResizeHandler = () => {
                const landscape = window.innerWidth > window.innerHeight;
                showOrientationMask.value = landscape;
                isRotate.value = landscape;
                onOrientationUpdated();
                rotateEventId.value++;
            };
        }
    };
    initOrientationWatch();
});
onMounted(() => {
    // 获取屏幕宽度和高度
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    rotateLeftNum.value = (screenWidth.value - screenHeight.value) / 2;
    rotateRightNum.value = (screenHeight.value - screenWidth.value) / 2;
});
const rotateRightNum: Ref<number> = ref((screenHeight.value - screenWidth.value) / 2);
const rotateLeftNum: Ref<number> = ref((screenWidth.value - screenHeight.value) / 2);
const pageContainerRef = ref<HTMLDivElement | null>(null);
const rotateEventId = ref(0);
watch(
    [isRotate, rotateEventId],
    () => {
        if (isRotate.value) {
            renderOptions2();
        } else {
            renderOptions();
        }
    },
    { immediate: true }
);
const data = ref<string | null>(null);
// 控制提示文字显隐：有签名内容隐藏，画板为空显示
const showOverlay = ref(true);
watch(
    () => data.value,
    (val) => {
        showOverlay.value = !(val && String(val).length > 0);
    }
);
function renderOptions() {
    options.value = reactive<IOptions>({
        isFullScreen: false, // 不使用全屏模式，使用自定义尺寸
        isFullCover: false, // 不覆盖所有元素
        isDpr: false, // 启用高分屏兼容
        lastWriteSpeed: 1, // 书写速度
        lastWriteWidth: 3, // 下笔宽度
        lineCap: "round", // 圆形线帽，更自然
        lineJoin: "round", // 圆角连接，更平滑
        canvasWidth: screenWidth.value - 120, // 还原为未旋转坐标系下的宽度
        canvasHeight: screenHeight.value - 200, // 还原为未旋转坐标系下的高度
        isShowBorder: false, // 显示边框便于定位
        bgColor: "transparent", // 白色背景
        borderWidth: false, // 边框宽度
        borderColor: "#e0e0e0", // 浅灰色边框
        writeWidth: 5, // 基础轨迹宽度
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: "#101010", // 轨迹颜色  [String] 可选
        isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        imgType: "png", //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的.
        quality: 1, //  图片压缩系数[0-1]之间 可以选 默认为1
    });
}
function renderOptions2() {
    options.value = reactive<IOptions>({
        isFullScreen: false, // 不使用全屏模式，使用自定义尺寸
        isFullCover: false, // 不覆盖所有元素
        isDpr: false, // 启用高分屏兼容
        lastWriteSpeed: 1, // 书写速度
        lastWriteWidth: 3, // 下笔宽度
        lineCap: "round", // 圆形线帽，更自然
        lineJoin: "round", // 圆角连接，更平滑
        canvasWidth: screenWidth.value - 200, // 还原为未旋转坐标系下的宽度
        canvasHeight: screenHeight.value - 120, // 还原为未旋转坐标系下的高度
        isShowBorder: false, // 显示边框便于定位
        bgColor: "transparent", // 白色背景
        borderWidth: false, // 边框宽度
        borderColor: "#e0e0e0", // 浅灰色边框
        writeWidth: 5, // 基础轨迹宽度
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: "#101010", // 轨迹颜色  [String] 可选
        isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        imgType: "png", //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的.
        quality: 1, //  图片压缩系数[0-1]之间 可以选 默认为1
    });
}
const SignCanvasPlusRef = ref<any>(null);
const onOrientationUpdated = async () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    rotateLeftNum.value = (screenWidth.value - screenHeight.value) / 2;
    rotateRightNum.value = (screenHeight.value - screenWidth.value) / 2;
    if (isRotate.value) {
        renderOptions2();
    } else {
        renderOptions();
    }
};
/**
 * 清除画板
 */
const canvasClear = () => {
    SignCanvasPlusRef.value.canvasClear();
    data.value = null; // 清除data变量
    showOverlay.value = true; // 重新显示提示
};
const trimTransparent = (src: string, padding = 16): Promise<string> => {
    return new Promise((resolve) => {
        const s = String(src).replace(/^\//, "");
        const dataUrl = s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(src);
            ctx.drawImage(image, 0, 0);
            const w = canvas.width;
            const h = canvas.height;
            const imgData = ctx.getImageData(0, 0, w, h);
            const pixels = imgData.data;
            let minX = w - 1,
                minY = h - 1,
                maxX = 0,
                maxY = 0,
                found = false;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const i = (y * w + x) * 4 + 3;
                    if (pixels[i] > 0) {
                        found = true;
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (!found) return resolve(src);
            const pad = Math.max(0, Math.floor(padding));
            const sx = Math.max(0, minX - pad);
            const sy = Math.max(0, minY - pad);
            const sw = Math.min(w - sx, maxX - minX + 1 + pad * 2);
            const sh = Math.min(h - sy, maxY - minY + 1 + pad * 2);
            const out = document.createElement("canvas");
            out.width = sw;
            out.height = sh;
            const octx = out.getContext("2d");
            if (!octx) return resolve(src);
            octx.clearRect(0, 0, sw, sh);
            octx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
            resolve(out.toDataURL("image/png"));
        };
        image.onerror = () => resolve(src);
        image.src = dataUrl;
    });
};
/**
 * 保存图片
 */
const saveAsImg = async () => {
    if (!data.value) {
        return showDialog({
            title: "提示",
            message: "请先签名",
        });
    }
    let img = SignCanvasPlusRef.value.saveAsImg();
    if (!isRotate.value && img) {
        try {
            const rotated = await new Promise<string>((resolve) => {
                const s = String(img).replace(/^\//, "");
                const src = s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = image.height;
                    canvas.height = image.width;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return resolve(img);
                    ctx.translate(0, canvas.height);
                    ctx.rotate(-Math.PI / 2);
                    ctx.drawImage(image, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                };
                image.onerror = () => resolve(img);
                image.src = src;
            });
            img = rotated;
        } catch {}
    }
    try {
        img = await trimTransparent(img, 24);
    } catch {}
    try {
        const existingSignatures = JSON.parse(localStorage.getItem("signature_list") || "[]");
        existingSignatures.forEach((item) => {
            localStorage.removeItem(item.key);
        });
        const timestamp = new Date().getTime();
        const storageKey = "current_signature";
        localStorage.setItem(storageKey, img);
        const currentSignature = [
            {
                key: storageKey,
                timestamp: timestamp,
                date: new Date().toLocaleString(),
            },
        ];
        localStorage.setItem("signature_list", JSON.stringify(currentSignature));
        navigateTo("/confirm");
    } catch (error) {
        console.error("保存签名到本地存储失败:", error);
        alert("保存失败，可能是存储空间不足");
    }
};
onUnmounted(() => {
    if (metaViewportRef.value && metaViewportRef.value.parentNode) {
        metaViewportRef.value.parentNode.removeChild(metaViewportRef.value);
        metaViewportRef.value = null;
    }
    // 清理监听
    try {
        if (orientationMql) {
            if (orientationChangeHandler) {
                // @ts-ignore
                if (orientationMql.removeListener) {
                    orientationMql.removeListener(orientationChangeHandler);
                } else if (orientationMql.removeEventListener) {
                    orientationMql.removeEventListener("change", orientationChangeHandler);
                }
            }
        }
        if (resizeHandler) {
            window.removeEventListener("resize", resizeHandler);
        }
        if (windowOrientationHandler) {
            window.removeEventListener("orientationchange", windowOrientationHandler);
        }
    } catch {}
});
</script>
<style scoped>
.preview-img {
    display: block;
    margin: 20px auto;
}

.control {
    width: 350px;
    margin: 20px auto;
    font-size: 14px;
}

ul {
    text-align: left;
    li {
        list-style: none;
        padding: 4px 10px;
    }
}

.sign-btns {
    display: flex;
    justify-content: space-between;
}

.clear,
.save {
    width: 76px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #eee;
    background: #e1e1e1;
    border-radius: 10px;
    text-align: center;
    margin: 20px auto;
    cursor: pointer;
}
.sign-canvas :deep(.van-signature__content) {
    height: 80dvh;
    min-height: 100vh;
}
:deep(.van-signature__footer) {
    display: none;
}
.action-buttons {
    position: fixed;
    bottom: 12px;
    right: 50px;
    z-index: 1000;
    display: flex;
    gap: 8px;
}
@media (orientation: landscape) {
    .action-buttons {
        display: flex;
    }
}

/* SignCanvasPlus 样式 */
.sign-canvas-plus {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 2px;
    flex: 1;
    height: calc(100% - 50px);
    min-height: 250px;
    position: relative; /* 允许覆盖文字绝对定位 */
}

.sign-canvas-plus2 {
    height: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 横屏时的特殊样式 */
@media (orientation: landscape) {
    .sign-canvas-plus {
        margin: 2px;
        padding: 0;
        height: calc(99vh - var(--van-nav-bar-height));
    }
}

/* 覆盖提示文字层 */
.sign-overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; /* 不阻挡签名交互 */
    z-index: 10;
    width: 80%;
}
.overlay-inner {
    text-align: center;
    color: #8a8a8a;
    font-size: 16px;
    line-height: 1.6;
}
/* 字体在不同屏幕下自适应（覆盖默认字号） */
.overlay-inner {
    font-size: clamp(14px, 2.2vw, 18px);
}
.tip-text {
    font-size: clamp(13px, 2.5vw, 16px);
}
/* 禁用浏览器默认触控手势，确保触控坐标与绘制一致 */
.sign-canvas {
    touch-action: none;
    display: block;
}

/* 横屏遮罩样式 */
.orientation-overlay {
    position: fixed;
}
.orientation-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
}
.phone-icon {
    display: inline-block;
    width: 72px;
    height: 112px;
    border-radius: 12px;
    border: 3px solid rgba(255, 255, 255, 0.85);
    position: relative;
    margin: 0 auto 16px;
    transform: rotate(90deg);
    animation: rotation 1.5s ease-in-out infinite;
}
.phone-icon::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 8px;
    width: 28px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.85);
    transform: translateX(-50%);
}
.tip-text {
    font-size: 15px;
    line-height: 1.7;
    padding: 0 24px;
}
@keyframes rotation {
    10% {
        transform: rotate(90deg);
    }
    50%,
    60% {
        transform: rotate(0deg);
    }
    90%,
    100% {
        transform: rotate(90deg);
    }
}
</style>
