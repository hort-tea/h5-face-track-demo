<script lang="ts" setup>
const faceList = useState<string[]>("face-list", () => []);
</script>
<template>
    <div class="container mx-auto">
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
            <div class="flex flex-wrap items-center justify-between my-8">
                <div
                    v-for="(item, index) in faceList"
                    class="my-1"
                    :key="item"
                >
                    <van-image
                        width="100"
                        height="134"
                        fit="cover"
                        :src="item"
                        @click="showImagePreview(faceList, index)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
