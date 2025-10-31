<template>
    <van-nav-bar
        title="核身验证"
        left-text="返回"
        left-arrow
        @click-left="navigateTo('/upload')"
    />
    <div class="p-4 bg-gray-50">
        <div class="container mx-auto bg-white">
            <PhotoStep :active="1" />
            <div class="px-6">
                <div
                    class="flex mt-8 items-center justify-center color-blue-600"
                >
                    <div class="i-tabler:face-id text-6xl"></div>
                </div>
                <div class="mt-8 mb-2 text-xl">您即将進行实名核身驗證</div>
                <div class="text-sm mb-12">
                    為了您順利通過認證，請先確認認證設備與環境滿足以下條件：
                </div>
                <div class="flex flex-col space-y-8 mb-12 text-base">
                    <div class="flex items-center">
                        <div
                            class="i-tabler:device-mobile-star mr-1 color-blue-600"
                        ></div>
                        手機屏幕亮度调制最大
                    </div>
                    <div class="flex items-center">
                        <div class="i-tabler:sun mr-1 color-blue-600"></div>
                        避免環境光過強或過暗
                    </div>
                    <div class="flex items-center">
                        <div
                            class="i-tabler:user-circle mr-1 color-blue-600"
                        ></div>
                        正面臉部对准手機拍攝
                    </div>
                    <div class="flex items-center">
                        <div class="i-tabler:camera mr-1 color-blue-600"></div>
                        請允許瀏覽器使用拍攝相片功能
                    </div>
                </div>
                <van-button
                    type="primary"
                    block
                    :to="{ path: '/face', query: { mode: 'user' } }"
                >
                    我是申請人本人
                    <br />
                    <span class="text-xs">（使用相機自拍鏡頭）</span>
                </van-button>
                <div class="mt-4">
                    <van-button
                        type="success"
                        block
                        :to="{ path: '/face', query: { mode: 'environment' } }"
                    >
                        申請人需要協助
                        <br />
                        <span class="text-xs">
                            （請將手機後鏡頭根據提示對準申請人）
                        </span>
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>
