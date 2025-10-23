<template>
    <div class="font-sans">
        <div class="bg-blue-500 text-white text-center py-4 text-lg font-bold">
            台胞證申請制證相片上傳平台
        </div>
        <!-- Main Content -->
        <div class="p-4 bg-gray-50">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <!-- Alert -->
                <div class="flex items-start bg-yellow-50 p-3 rounded-md">
                    <div
                        class="i-tabler-alert-triangle text-yellow-500 text-2xl mr-3"
                    ></div>
                    <div>
                        <p class="font-bold text-gray-800 my-0">為符合保推廣</p>
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
                            本平台將採用實名相片上傳測,確保您上傳的相片符合基本規範要求
                        </p>
                    </div>
                    <div class="flex items-start">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white text-sm rounded-full flex items-center justify-center mr-3"
                        >
                            5
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
                <!-- Action Buttons -->
                <div class="mt-8 grid grid-cols-2 gap-4">
                    <van-button
                        type="primary"
                        block
                        @click="navigateTo('/upload')"
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
            </div>
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
                            images: ['/image/gf.jpg'],
                            closeable: true,
                        })
                    "
                />
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
const showPolicy = ref(false);
const showPhotoRule = ref(false);
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
</style>
