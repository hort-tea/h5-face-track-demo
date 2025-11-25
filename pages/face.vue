<script setup lang="ts">
import { useRoute } from "vue-router";
import { TIPS } from "@/composables/useFaceTrack";
const route = useRoute();
const { init, tips, tracker, video, distanceRatio } = useFaceTrack(
    (route.query.mode as "user" | "environment") || "user"
);
/**
 * 人脸结果
 */
const faceResultList = useState<string[]>("face-list", () => []);
faceResultList.value = [];
// 记录最近一次人脸检测的边界框
const lastFaceRect = ref<{
    x: number;
    y: number;
    width: number;
    height: number;
} | null>(null);
/**
 * 获取 9 个人头
 */
const maxResultCount = 3;
/**
 * 已经获取了的人脸数
 */
const currentResultCount = computed(() => faceResultList.value.length);
/**
 * 随便写的颜色
 */
const colors = ["bg-white", "bg-red", "bg-blue", "bg-yellow", "bg-green"];
/**
 * 模拟自动换颜色
 */
const currentColor = computed(
    () => colors[currentResultCount.value % colors.length]
);

/**
 * 调用初始化
 */
init();
/**
 * 节流使用 canvas 保存人脸
 */
const saveFace = useThrottleFn(() => {
    // 太近時不保存，提示請遠一些（文案由 tips 顯示）
    if (tips.value === TIPS.TOO_CLOSE) return;
    if (!video.value) return;
    const v = video.value;
    // 目标画布按 4:5 比例
    const targetWidth = 400;
    const targetHeight = 500;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sourceWidth = v.videoWidth;
    const sourceHeight = v.videoHeight;
    let sx = 0,
        sy = 0,
        sWidth = sourceWidth,
        sHeight = sourceHeight;

    if (lastFaceRect.value) {
        const displayW = v.clientWidth;
        const displayH = v.clientHeight;
        // 当 video 使用 object-fit: cover（通过 class object-cover 设置）时，
        // 实际显示的内容会按比例放大并居中裁切。需要计算缩放与偏移，
        // 将显示坐标转换为源视频像素坐标，避免横向（或纵向）被压缩的错觉。
        const scale = Math.max(displayW / sourceWidth, displayH / sourceHeight);
        const contentW = sourceWidth * scale;
        const contentH = sourceHeight * scale;
        const offsetX = (displayW - contentW) / 2; // 左右被裁掉的像素（显示坐标系）
        const offsetY = (displayH - contentH) / 2; // 上下被裁掉的像素（显示坐标系）
        const rect = lastFaceRect.value;
        // 人脸中心（源视频像素坐标）
        const cx = (rect.x - offsetX + rect.width / 2) / scale;
        const cy = (rect.y - offsetY + rect.height / 2) / scale;
        // 以人脸宽度为基准，按倍数放大裁剪宽度，并严格保持 4:5 比例
        const baseWidth = rect.width / scale;
        const desiredWidthRaw = Math.max(baseWidth * 2, 200);
        const maxWidthByHeight = Math.floor(sourceHeight * (4 / 5));
        const maxWidthByWidth = sourceWidth;
        sWidth = Math.min(desiredWidthRaw, maxWidthByHeight, maxWidthByWidth);
        sHeight = Math.floor(sWidth * (5 / 4));
        sx = Math.max(0, Math.floor(cx - sWidth / 2));
        sy = Math.max(0, Math.floor(cy - sHeight / 2));
        if (sx + sWidth > sourceWidth) sx = sourceWidth - sWidth;
        if (sy + sHeight > sourceHeight) sy = sourceHeight - sHeight;
    } else {
        // 无检测结果时，做居中 4:5 裁剪
        const desiredWidth = Math.min(
            sourceWidth,
            Math.floor(sourceHeight * (4 / 5))
        );
        sWidth = desiredWidth;
        sHeight = Math.floor(desiredWidth * (5 / 4));
        sx = Math.floor((sourceWidth - sWidth) / 2);
        sy = Math.floor((sourceHeight - sHeight) / 2);
    }
    ctx.drawImage(v, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    const dataUrl = canvas.toDataURL("image/jpeg", 1);
    faceResultList.value.push(dataUrl);
    try {
        const base64 = dataUrl.split(",")[1] || "";
        const sizeBytes = Math.ceil((base64.length * 3) / 4);
        const sizeKB = (sizeBytes / 1024).toFixed(2);
        console.log(`[face] 保存图片大小: ${sizeBytes} bytes (${sizeKB} KB)`);
    } catch (e) {
        console.log("[face] 计算图片大小失败", e);
    }
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "face-list",
                JSON.stringify(faceResultList.value)
            );
        }
    } catch (e) {
        // 忽略本地存儲異常
    }
}, 500);

/**
 * 人脸数够了就停止并跳转到结果页
 */
watchEffect(() => {
    if (faceResultList.value.length >= maxResultCount) {
        stop();
        navigateTo("/result", {
            replace: true,
        });
    }
});

onMounted(() => {
    tracker.value?.on("track", (event) => {
        // 检测到人脸就保存，顺便记录最大人脸框
        if (event.data.length) {
            const rect = event.data.reduce((max: any, curr: any) => {
                const areaCurr = curr.width * curr.height;
                const areaMax = max.width * max.height;
                return areaCurr > areaMax ? curr : max;
            }, event.data[0]);
            lastFaceRect.value = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            };
            saveFace();
        }
    });
});
</script>

<template>
    <div
        class="w-screen h-screen flex flex-col justify-center items-center space-y-8 box-border pb-30"
        :class="currentColor"
    >
        <p class="text-sm px-6 text-center">{{ tips }}</p>
        <p class="text-xs px-6 text-center opacity-70">
            距離比例：{{ (distanceRatio * 100).toFixed(0) }}%
        </p>
        <div class="relative">
            <video
                ref="video"
                muted
                autoplay
                webkit-playsinline
                playsinline
                x5-video-player-type="h5-page"
                class="w-50 h-50 rounded-full object-cover bg-black"
                :class="((route.query.mode as 'user' | 'environment') || 'user') === 'user' ? 'rotate-y-180' : ''"
            />
            <van-circle
                :current-rate="(currentResultCount / maxResultCount) * 100"
                layer-color="#eee"
                :rate="maxResultCount"
                class="w-50! h-50! absolute! left-0 top-0"
            />
        </div>
    </div>
</template>
