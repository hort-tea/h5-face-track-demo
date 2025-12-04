<template>
    <div
        class="font-sans"
        v-if="!showLoading"
    >
        <div class="bg-blue-500 text-white text-center py-4 text-lg font-bold">
            台胞證申請制證相片上傳平台
        </div>
        <!-- Main Content -->
        <div class="p-4 bg-gray-50">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <!-- type == 2 -->
                <div
                    class="text-red-500 font-bold mb-4"
                    v-if="pageType === '2'"
                >
                    {{ userInfo.big_name }}
                    {{
                        userInfo.sexType === "1" ? "先生" : "女士"
                    }}，您的台胞證申請經相關審核單位通知，相片不符相關規範，需重新上傳制證相片(大頭照)，請通過以下連結完成，如有疑慮，請洽本公司官方帳號或電話詢問，謝謝！
                    <div
                        class="text-center mt-4 flex items-center justify-center"
                    >
                        <span class="text-gray-700 text-sm">鏈接將於：</span>
                        <van-count-down
                            :time="dateTime"
                            format="DD 天 HH 时 mm 分 ss 秒"
                        />
                        <span class="text-gray-700 text-sm">
                            &nbsp;&nbsp;失效
                        </span>
                    </div>
                </div>
                <!-- type == 3 -->
                <div
                    class="text-red-500 font-bold mb-4"
                    v-if="pageType === '3'"
                >
                    {{ userInfo.big_name }}
                    {{ userInfo.sexType === "1" ? "先生" : "女士" }}，
                    您的台胞證申請經相關審核單位通知，製證照片(大頭照)與提供的證件有差異，請通過以下連結完成身份驗證，如有疑慮，請洽本公司官方帳號或電話詢問，謝謝！
                    <div class="text-center mt-4">
                        鏈接失效時間：
                        <van-count-down
                            :time="dateTime"
                            format="DD 天 HH 时 mm 分 ss 秒"
                        />
                    </div>
                </div>
                <!-- Alert -->
                <div class="flex items-start bg-yellow-50 p-3 rounded-md">
                    <div
                        class="i-tabler-alert-triangle text-yellow-500 text-2xl mr-3"
                    ></div>
                    <div>
                        <p class="font-bold text-gray-800 my-0">
                            為符合環保推廣
                        </p>
                        <p class="text-sm text-gray-600 mt-1 my-0">
                            本系統僅為提供申請台胞證的制證相片電子檔上傳使用,請注意以下事項:
                        </p>
                    </div>
                </div>
                <!-- Rules List -->
                <div class="mt-6 space-y-4">
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            1
                        </div>
                        <p class="text-gray-700 my-0">
                            請確保上傳之相片清晰度足夠,且檔案大小不超過2MB
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            2
                        </div>
                        <p class="text-gray-700 my-0">
                            請確認上傳之相片符合中國大陸地區台胞證相片規範要求。
                            <a
                                href="#"
                                class="text-blue-500"
                                @click.prevent="showPhotoRule = true"
                            >
                                相片規範連結
                            </a>
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            3
                        </div>
                        <p class="text-gray-700 my-0">
                            本平台僅作為相片電子檔上傳,但相關之送件材料仍须按標準送件方式處理
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            4
                        </div>
                        <p class="text-gray-700 my-0">
                            本平台將採用實名相片上傳檢測,確保您上傳的相片符合基本規範要求
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            5
                        </div>
                        <p class="text-gray-700 my-0">
                            操作過程中，如遇是否允許讀取檔案、
                            拍攝相片及錄製影片的提示畫面，請點選 「允許」
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            6
                        </div>
                        <p class="text-gray-700 my-0">
                            當您按下同意時,即代表您已同意本平台之
                            <a
                                href="#"
                                class="text-blue-500"
                                @click.prevent="showPolicy = true"
                            >
                                個資聲明同意書連結
                            </a>
                        </p>
                    </div>
                </div>
                <div class="text-sm text-gray-600 mt-4 text-red">
                    本連結如操作失敗2次或上傳成功後將會失效，如需重新獲取連結請洽您的台胞證接洽窗口人員
                </div>
            </div>
        </div>
        <div class="face-blok h-30"></div>
        <!-- Action Buttons -->
        <div
            class="fixed left-0 right-0 bottom-0 bg-white p-4 grid grid-cols-2 gap-4"
            style="padding-bottom: calc(env(safe-area-inset-bottom) + 1rem)"
        >
            <van-button
                type="primary"
                block
                @click="navigateTo('/idCard')"
            >
                同意使用
            </van-button>
            <van-button
                type="default"
                block
            >
                離開
            </van-button>
        </div>
        <van-dialog
            v-model:show="showPolicy"
            class="policy-dialog"
            title="個資蒐集同意聲明"
            show-cancel-button
            cancel-button-text="取消"
            confirm-button-text="同意"
        >
            <div class="text-sm text-gray-700 leading-relaxed space-y-2">
                <p class="my-0">
                    當您使用「台胞證申請制證相片自助上傳平台」（以下簡稱本平台）網路申請服務時，需填入個人資料（如姓名、電話、身分證字號、手機、通訊地址、可辨識本人身份的相片等）依據個人資料保護法規定，本平台有義務告知以下事項，在您提供個人資料前請前務必詳閱：
                </p>
                <p class="font-bold my-0">1. 蒐集之目的：</p>
                <p class="my-0">
                    003 入出國及移民、090 消費者、客戶管理與服務、168
                    護照、簽證及文件證明處理、170
                    觀光行政、觀光旅館業、旅館業、旅行業、觀光遊樂業及民宿經營管理業務。
                </p>
                <p class="font-bold my-0">2. 個人資料之類別：</p>
                <p class="my-0">C001辨識個人者。</p>
                <p class="font-bold my-0">
                    3. 個人資料使用之期間、地區、對象及方式：
                </p>
                <p class="my-0">
                    3.1.
                    期間：個人資料蒐集之特定目的存續期間或本平台依相關法令所必須之保存期間。
                </p>
                <p class="my-0">3.2. 地區：本平台提供服務之地區。</p>
                <p class="my-0">
                    3.3.
                    對象：具備送辦台胞證資格之旅行社(甲種或綜合)、中國大陸地區台胞證相關審批及簽發單位。
                </p>
                <p class="my-0">
                    3.4.
                    方式：以自動化機器或其他非自動化之利用方式，將個人資料提供予該申請案件權責機關。
                </p>
                <p class="font-bold my-0">
                    4.
                    依據「個人資料保護法」第三條規定，您得就個人資料依法行使下列權利：
                </p>
                <p class="my-0">4.1. 得查詢、請求閱覽或請求製給複製本。</p>
                <p class="my-0">4.2. 得請求補充或更正。</p>
                <p class="my-0">4.3. 得請求停止搜集、處理或利用及請求刪除。</p>
                <p class="font-bold my-0">
                    5.
                    您可自由選擇是否提供相關個人資料，惟您若拒絕提供相關個人資料，本平台將無法提供相關服務。
                </p>
            </div>
        </van-dialog>
        <van-dialog
            v-model:show="showPhotoRule"
            class="photo-dialog"
            title="相片規範"
            show-cancel-button
            cancel-button-text="關閉"
        >
            <div class="w-full h-full flex items-center justify-center">
                <img
                    src="/image/gf.jpg"
                    alt="相片規範"
                    class="max-w-full w-full h-auto"
                    @click="
                        showImagePreview({
                            images: [`${baseURL}/image/gf.jpg`],
                            closeable: true,
                        })
                    "
                />
            </div>
        </van-dialog>
    </div>
    <FullScreenLoading
        :visible="showLoading"
        message="驗證中..."
    />
</template>

<script setup>
import { check_token } from "@/services/face";
const {
    app: { baseURL },
} = useRuntimeConfig();
const showPolicy = ref(false);
const showPhotoRule = ref(false);
const route = useRoute();
const router = useRouter();
const query = route.query;
const { t: token, e: time } = query;
const currentTime = Date.now();
const showLoading = ref(true);
if (!token || !time) {
    //验证token和time是否存在 不存在则跳转到状态页面提示 无法访问鉴权失败
    router.replace({
        path: "auth",
        query: {
            type: "auth",
        },
    });
}
// 為真的得判斷一下參數是否異常
if (token || time) {
    const hasSymbol = /[^A-Za-z0-9_-]/.test(token);
    const timeIsNumber = /^\d+$/.test(time);
    if (
        hasSymbol ||
        !timeIsNumber ||
        token.length !== 46 ||
        time.length !== 10
    ) {
        router.replace({
            path: "auth",
            query: {
                type: "auth",
            },
        });
    }
}
// 計算當前時間和時間戳間的差值
const dateTime = Number(time) * 1000 - currentTime;
// 验证时间是否过期
const isExpired = dateTime <= 0;
if (isExpired) {
    router.replace({
        path: "auth",
        query: {
            type: "timeout",
        },
    });
}
const userInfo = ref(null);
const pageType = ref(null);
if (
    token &&
    time &&
    !/[^A-Za-z0-9_-]/.test(token) &&
    /^\d+$/.test(time) &&
    token.length === 46 &&
    time.length === 10 &&
    !isExpired
) {
    check_token({ token })
        .then((res) => {
            localStorage.setItem("age", res.result.age || 16);
            localStorage.setItem("token", res.result.token);
            localStorage.setItem("btoken", res.result.btoken);
            localStorage.setItem("pageType", res.result.type);
            localStorage.setItem("identity", res.result.identity);
            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    big_name: res.result.big_name,
                    sex: res.result.sex === "1" ? "男" : "女",
                    sexType: res.result.sex,
                })
            );
            localStorage.setItem("pass_score", res.result.pass_score);
            localStorage.setItem("height_score", res.result.height_score);
            userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
            console.log(
                JSON.parse(localStorage.getItem("userInfo")),
                "用戶信息"
            );
            pageType.value = localStorage.getItem("pageType");
            let baidu = undefined;
            let callbackUrl = undefined;
            let localtionHref =
                "https://" +
                window.location.hostname +
                window.location.pathname;
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
            localStorage.setItem("localtionHref", localtionHref);
            localStorage.setItem("baidu", baidu);
            localStorage.setItem("callbackUrl", callbackUrl);
            showLoading.value = false;
        })
        .catch((err) => {
            console.log(err, "err");
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
        .finally(() => {});
}
</script>
<style scoped>
:deep(.van-dialog__content) {
    height: 60dvh;
    min-height: 60vh;
    padding: 30px;
    overflow-y: auto;
    text-align: left;
}
.photo-dialog :deep(.van-dialog__content) {
    padding: 0;
}
:deep(.van-count-down) {
    font-size: 0.9rem;
    color: #ef4444;
}
</style>
