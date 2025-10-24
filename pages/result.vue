<script lang="ts" setup>
const faceList = useState<string[]>("face-list", () => []);
</script>
<template>
    <van-nav-bar
        title="验证结果"
        left-text="返回"
        left-arrow
        @click-left="navigateTo('/beforeFace')"
    />
    <div class="p-4 bg-gray-50">
        <div class="container mx-auto bg-white">
            <div class="box-border px-6">
                <van-empty>
                    <div
                        class="flex flex-col items-center space-y-2 justify-center"
                    >
                        <div>
                            您的相片初步符合要求，並將於您簽名確認後上傳至平台
                            後續請攜帶相關材料至本公司受理櫃檯辦理申請。
                            如相片於後續審查不符規範，可由本公司受理櫃檯協助進行重新拍攝符合規範之制證相片
                        </div>
                        <div class="text-sm color-stone">
                            验证已通过，点击签名继续操作
                        </div>
                    </div>
                    <template #image>
                        <div
                            class="flex h-full text-9xl color-green items-center justify-center"
                        >
                            <div class="i-tabler:discount-check-filled"></div>
                        </div>
                    </template>
                </van-empty>
                <van-button
                    type="primary"
                    block
                    @click="navigateTo('/signature')"
                >
                    签名
                </van-button>
                <div
                    class="flex items-center justify-center my-8"
                    v-if="faceList.length > 0"
                >
                    <div class="my-1">
                        <van-image
                            width="100"
                            height="134"
                            fit="cover"
                            :src="faceList[0]"
                            @click="showImagePreview(faceList, 0)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
