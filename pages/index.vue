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
    </div>
</template>

<script setup>
// No script needed for pure layout
</script>
