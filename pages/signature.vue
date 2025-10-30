<template>
    <div
        class="box-border bg-white fixed top-0 left-0 flex flex-col"
        :style="{
            width: screenHeight + 'px',
            height: screenWidth + 'px',
            transform: 'rotate(90deg)',
            transformOrigin: `${screenHeight / 2}px ${screenWidth / 2}px`,
            left: `${(screenWidth - screenHeight) / 2}px`,
            top: `${(screenHeight - screenWidth) / 2}px`,
        }"
    >
        <van-nav-bar
            title=""
            left-text="申請人簽名(註:未成年請簽監護人姓名)"
            right-text=""
            left-arrow
            @click-left="goBackTwo"
        >
            <template #right>
                <div class="flex gap-2 items-center px-4">
                    <van-button
                        size="small"
                        type="warning"
                        plain
                        @click="canvasClear"
                    >
                        重簽
                    </van-button>
                    <van-button
                        size="small"
                        type="primary"
                        @click="saveAsImg"
                    >
                        確定
                    </van-button>
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
                    height: `${screenHeight - 120}px`,
                    boxSizing: 'content-box',
                    borderRadius: '20px',
                    border: '2px dashed #ccc',
                    background: '#f9f9f9 !important',
                }"
            ></SignCanvasPlus>
            <!-- 居中背景提示文字 -->
            <div
                class="sign-overlay-text"
                v-show="showOverlay"
            >
                <div class="overlay-inner">
                    <div>請在此區域內簽名</div>
                    <div>中文正楷簽名</div>
                </div>
            </div>
        </div>
        <!-- <van-signature
            class="sign-canvas"
            ref="signatureRef"
            @submit="onSubmit"
            @clear="onClear"
        /> -->
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
</template>
<script lang="ts" setup>
import SignCanvasPlus, { IOptions } from "sign-canvas-plus";
const router = useRouter();
const goBackTwo = () => {
    router.go(-1);
};
const screenWidth = ref<number>(0);
const screenHeight = ref<number>(0);
const options = ref<IOptions>({});
onMounted(() => {
    // 获取屏幕宽度和高度
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    renderOptions();
});
const data = ref<string | null>(null);
// 控制提示文字显隐：有签名内容隐藏，画板为空显示
const showOverlay = ref(true);
watch(
    () => data.value,
    (val) => {
        showOverlay.value = !(val && String(val).length > 0);
    }
);
const renderOptions = () => {
    options.value = reactive<IOptions>({
        isFullScreen: false, // 不使用全屏模式，使用自定义尺寸
        isFullCover: false, // 不覆盖所有元素
        isDpr: true, // 启用高分屏兼容
        lastWriteSpeed: 1, // 书写速度
        lastWriteWidth: 3, // 下笔宽度
        lineCap: "round", // 圆形线帽，更自然
        lineJoin: "round", // 圆角连接，更平滑
        canvasWidth: screenWidth.value - 120, // 还原为未旋转坐标系下的宽度
        canvasHeight: screenHeight.value - 120, // 还原为未旋转坐标系下的高度
        isShowBorder: true, // 显示边框便于定位
        bgColor: "#f9f9f9", // 白色背景
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
};
const SignCanvasPlusRef = ref<InstanceType<typeof SignCanvasPlus | null>>(null);
/**
 * 清除画板
 */
const canvasClear = () => {
    SignCanvasPlusRef.value.canvasClear();
    data.value = null; // 清除data变量
    showOverlay.value = true; // 重新显示提示
};
/**
 * 保存图片
 */
const saveAsImg = async () => {
    if (!data.value) {
        alert("请先签名");
        return;
    }
    let img = SignCanvasPlusRef.value.saveAsImg();
    // 保存到本地存储
    try {
        // 清除之前保存的签名数据
        const existingSignatures = JSON.parse(
            localStorage.getItem("signature_list") || "[]"
        );
        // 删除之前的签名图片数据
        existingSignatures.forEach((item) => {
            localStorage.removeItem(item.key);
        });
        // 使用固定的存储键名，只保存一个签名
        const timestamp = new Date().getTime();
        const storageKey = "current_signature";

        // 保存新的签名到localStorage
        localStorage.setItem(storageKey, img);

        // 只保存当前这一个签名的信息
        const currentSignature = [
            {
                key: storageKey,
                timestamp: timestamp,
                date: new Date().toLocaleString(),
            },
        ];
        localStorage.setItem(
            "signature_list",
            JSON.stringify(currentSignature)
        );
        navigateTo("/confirm");
    } catch (error) {
        console.error("保存签名到本地存储失败:", error);
        alert("保存失败，可能是存储空间不足");
    }
};

/**
 * 查看当前保存的签名
 */
const viewSavedSignatures = () => {
    try {
        const signatureList = JSON.parse(
            localStorage.getItem("signature_list") || "[]"
        );

        if (signatureList.length === 0) {
            alert("暂无已保存的签名");
            return;
        }

        const currentSignature = signatureList[0]; // 只有一个签名
        const imageData = localStorage.getItem(currentSignature.key);

        if (!imageData) {
            alert("签名数据已损坏");
            return;
        }

        // 显示签名信息
        const message = `当前保存的签名：\n保存时间: ${currentSignature.date}\n\n点击确定查看签名图片`;

        if (confirm(message)) {
            // 在新窗口显示签名图片
            const newWindow = window.open("", "_blank");
            if (newWindow) {
                newWindow.document.write(`
                    <html>
                        <head><title>当前签名预览</title></head>
                        <body style="margin:0;padding:20px;text-align:center;">
                            <h3>当前签名 (${currentSignature.date})</h3>
                            <img src="${imageData}" style="max-width:100%;border:1px solid #ccc;" />
                        </body>
                    </html>
                `);
            }
        }
    } catch (error) {
        console.error("查看签名失败:", error);
        alert("查看失败，请检查本地存储");
    }
};

/**
 * 下载dealImage图片
 */
const dealImage = () => {
    SignCanvasPlusRef.value.dealImage();
};
const image = ref("");
const onSubmit = (data: { image: string }) => {
    image.value = data.image;
};
const onClear = () => showToast("clear");
const signatureRef = ref<any>(null);
const handleClear = () => signatureRef.value?.clear?.();
const handleConfirm = () => {
    signatureRef.value?.confirm?.();
    navigateTo("/");
};
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

/* 横屏时的特殊样式 */
@media (orientation: landscape) {
    .sign-canvas-plus {
        margin: 2px;
        padding: 0;
        height: calc(100% - 40px);
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
/* 禁用浏览器默认触控手势，确保触控坐标与绘制一致 */
.sign-canvas {
    touch-action: none;
    display: block;
}
</style>
