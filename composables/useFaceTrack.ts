export enum TIPS {
    DEFAULT = "未檢測到臉部, 請將正面臉部对准手機拍攝",
    SCANING = "正在識別，請保持姿勢不變",
    TOO_FAR = "距離過遠，請靠近一些",
    TOO_CLOSE = "距離過近，請稍微遠離一些",
}

function mediaErrorCaptured(error: any) {
    const nameMap = {
        AbortError: "操作中止",
        NotAllowedError: "打開設備權限不足，原因是用戶拒絕了媒體訪問請求",
        NotFoundError: "找不到滿足條件的設備",
        NotReadableError:
            "系統上某個硬件、瀏覽器或網頁層面發生的錯誤導致設備無法被訪問",
        OverConstrainedError: "指定的要求無法被設備滿足",
        SecurityError: "安全錯誤，使用設備媒體被禁止",
        TypeError: "類型錯誤",
        NotSupportedError: "不支持的操作",
        NetworkError: "網絡錯誤發生",
        TimeoutError: "操作超時",
        UnknownError: "因未知的瞬時的原因使操作失敗)",
        ConstraintError: "條件沒滿足而導致事件失敗的異常操作",
    };
    const messageMap = {
        "permission denied": "麥克風、攝像頭權限未開啟，請檢查後重試",
        "requested device not found": "未檢測到攝像頭",
        "could not start video source": "無法訪問到攝像頭",
    };

    let nameErrorMsg = nameMap[error.name as keyof typeof nameMap];
    if (!nameErrorMsg) {
        nameErrorMsg =
            messageMap[
                error.message.toLowerCase() as keyof typeof messageMap
            ] ?? "未知錯誤";
    }
    return nameErrorMsg;
}

export function useFaceTrack(mode: "user" | "environment") {
    const video = ref<HTMLVideoElement>();
    const { stream, start, stop } = useUserCamera(mode);
    const tips = ref<string>(TIPS.DEFAULT);
    const tracker = shallowRef<tracking.ObjectTracker>();
    // 估算距離的比例：人臉框高度 / 視訊顯示高度
    const distanceRatio = ref<number>(0);
    // 可調參的距離閾值（按顯示高度的比例）：僅在 10%～40% 間截取
    const MIN_RATIO = 0.1; // 低於則太遠
    const MAX_RATIO = 0.5; // 高於則太近
    function initTracker() {
        tracker.value = new tracking.ObjectTracker("face");
        tracker.value.setInitialScale(4);
        tracker.value.setStepSize(2);
        tracker.value.setEdgesDensity(0.1);
        tracking.track(video.value!, tracker.value);
        tracker.value.on("track", (event) => {
            if (event.data.length) {
                // 選擇最大的人臉框
                const rect = event.data.reduce((max: any, curr: any) => {
                    const areaCurr = curr.width * curr.height;
                    const areaMax = max.width * max.height;
                    return areaCurr > areaMax ? curr : max;
                }, event.data[0]);

                const displayH = video.value?.clientHeight || 0;
                const faceH = rect.height || 0;
                distanceRatio.value = displayH > 0 ? faceH / displayH : 0;

                if (
                    distanceRatio.value > 0 &&
                    distanceRatio.value < MIN_RATIO
                ) {
                    tips.value = TIPS.TOO_FAR;
                } else if (
                    distanceRatio.value > 0 &&
                    distanceRatio.value > MAX_RATIO
                ) {
                    tips.value = TIPS.TOO_CLOSE;
                } else {
                    tips.value = TIPS.SCANING;
                }
            } else {
                tips.value = TIPS.DEFAULT;
                distanceRatio.value = 0;
            }
        });
    }

    async function init() {
        try {
            await start();
        } catch (error) {
            tips.value = mediaErrorCaptured(error);
        }
    }

    async function tryPlay() {
        try {
            await video.value?.play();
        } catch (error) {}
    }

    watchEffect(() => {
        if (video.value) {
            video.value.srcObject = stream.value!;
            nextTick(async () => {
                await tryPlay();
                video.value?.addEventListener(
                    "loadeddata",
                    async () => {
                        await tryPlay();
                    },
                    {
                        once: true,
                    }
                );
            });
        }
    });

    onMounted(initTracker.bind(window));
    onUnmounted(() => {
        tracker.value?.removeAllListeners();
        stop();
    });

    return {
        video,
        stream,
        tips,
        init,
        tracker,
        distanceRatio,
    };
}
