<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const { init, tips, tracker, video } = useFaceTrack(
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
const maxResultCount = 9;
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
    if (!video.value) return;
    const v = video.value;
    // 目标画布按 3:4 比例（证件照常用比例）
    const targetWidth = 300;
    const targetHeight = 400;
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
        const scaleX = sourceWidth / displayW;
        const scaleY = sourceHeight / displayH;

        const rect = lastFaceRect.value;
        // 人脸中心（源视频像素坐标）
        const cx = (rect.x + rect.width / 2) * scaleX;
        const cy = (rect.y + rect.height / 2) * scaleY;

        // 以人脸宽度为基准，扩大到 2 倍作为裁剪宽度
        const baseWidth = rect.width * scaleX;
        const desiredWidth = Math.min(
            Math.max(baseWidth * 2, 200),
            sourceWidth
        );
        const desiredHeight = Math.min(
            Math.floor(desiredWidth * (4 / 3)),
            sourceHeight
        );

        sWidth = Math.min(desiredWidth, sourceWidth);
        sHeight = Math.min(desiredHeight, sourceHeight);

        sx = Math.max(0, Math.floor(cx - sWidth / 2));
        sy = Math.max(0, Math.floor(cy - sHeight / 2));

        if (sx + sWidth > sourceWidth) sx = sourceWidth - sWidth;
        if (sy + sHeight > sourceHeight) sy = sourceHeight - sHeight;
    } else {
        // 无检测结果时，做居中 3:4 裁剪
        const desiredWidth = Math.min(
            sourceWidth,
            Math.floor(sourceHeight * (3 / 4))
        );
        sWidth = desiredWidth;
        sHeight = Math.floor(desiredWidth * (4 / 3));
        sx = Math.floor((sourceWidth - sWidth) / 2);
        sy = Math.floor((sourceHeight - sHeight) / 2);
    }

    ctx.drawImage(v, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    faceResultList.value.push(canvas.toDataURL("image/png", 0.3));
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
        <p class="text-xl px-6 text-center">{{ tips }}</p>
        <div class="relative">
            <video
                ref="video"
                muted
                autoplay
                webkit-playsinline
                playsinline
                x5-video-player-type="h5-page"
                class="w-50 h-50 rounded-full object-cover rotate-y-180 bg-black"
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
