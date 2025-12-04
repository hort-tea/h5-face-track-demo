<template>
    <van-nav-bar
        title="證件號"
        left-text="返回"
        left-arrow
        @click-left="backUp"
    />
    <div class="p-4 bg-gray-50">
        <PhotoStep :active="0" />
        <div class="bg-white rounded-lg shadow-sm p-4">
            <!-- 输入身份证字号 -->
            <div class="mb-4">
                <van-field
                    :label-width="50"
                    v-model="idNumber"
                    :border="true"
                    label="身份證"
                    placeholder="請輸入身份證號"
                    clearable
                    input-align="left"
                    :error="idNumberError"
                    :error-message="idNumberErrorMessage"
                    @input="handleIdNumberInput"
                    @blur="handleIdNumberInput"
                />
            </div>
            <!-- 上传按钮 -->
            <div class="mt-8">
                <van-button
                    type="primary"
                    block
                    :disabled="!canUpload"
                    @click="handleUpload"
                >
                    下一步
                </van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
const idNumber = ref("");
const idNumberError = ref(false); // 身份证号错误状态
const idNumberErrorMessage = ref(""); // 身份证号错误信息
const pageType = ref(localStorage.getItem("pageType") || "");
// 处理身份证号码输入
const handleIdNumberInput = () => {
    const validation = validateIdNumber(idNumber.value);
    idNumberError.value = !validation.isValid;
    idNumberErrorMessage.value = validation.message;
};
// 身份证号码格式验证函数
// 台湾身份证首字母映射表
const twFirstCode = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    X: 30,
    Y: 31,
    W: 32,
    Z: 33,
    I: 34,
    O: 35,
};
function validateTWCard(id) {
    if (!id) return false;
    const first = id.slice(0, 1);
    const mid = id.slice(1, 9);
    const last = id.slice(9, 10);
    if (!/^[A-Z]$/.test(first)) return false;
    if (!/^\d{8}$/.test(mid)) return false;
    if (!/^\d$/.test(last)) return false;
    const code = twFirstCode[first.toUpperCase()];
    if (typeof code !== "number") return false;
    let sum = Math.floor(code / 10) + (code % 10) * 9;
    let weight = 8;
    for (const ch of mid) {
        sum += Number(ch) * weight;
        weight -= 1;
    }
    const expectedCheck = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return expectedCheck === Number(last);
}

function validateIdCard10(raw) {
    if (!raw) return false;
    const s = String(raw).replace(/[()]/g, "");
    if (!/^[A-Za-z]\d{9}$/.test(s)) return false;
    const genderCode = s.charAt(1);
    if (genderCode !== "1" && genderCode !== "2") return false;
    return validateTWCard(s);
}
const validateIdNumber = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: false, message: "請輸入身份證號" };
    }
    const ok = validateIdCard10(value.trim());
    if (!ok) {
        return { isValid: false, message: "身份證號碼格式錯誤" };
    }
    return { isValid: true, message: "" };
};
// 计算属性：判断是否可以上传
const canUpload = computed(() => {
    const validation = validateIdNumber(idNumber.value);
    return validation.isValid && idNumber.value.trim() !== "";
});
const handleUpload = () => {
    // 驗證身份證號是否一致
    if (idNumber.value.trim() != localStorage.getItem("identity")) {
        return showToast("驗證失敗：身份證號不一致");
    }
    // 驗證年齡是否在範圍內--不在年龄范围的不需要做百度活体检测
    const age = Number(localStorage.getItem("age"));
    if (!checkAgeRange(age)) {
        if (pageType.value == 3) {
            navigateTo({
                path: "/beforeFace",
            });
        } else {
            navigateTo({
                path: "/upload",
            });
        }
    }
    // 在区间范围的需要做百度活体检测
    if (checkAgeRange(age)) {
        // 驗證身份證號並跳轉到百度
        if (pageType.value == 3) {
            const baidu = localStorage.getItem("baidu");
            const callbackUrl = localStorage.getItem("callbackUrl");
            //跳轉到百度
            window.location.href =
                baidu + "&callbackUrl=" + encodeURIComponent(callbackUrl);
        } else {
            // 跳轉到上傳頁面
            navigateTo({
                path: "/upload",
            });
        }
    }
};
const backUp = () => {
    history.back();
};
</script>
<style scoped>
:deep(#van-field-1-input) {
    border-bottom: 1px solid #c4c4c4;
}
:deep(.van-uploader__preview) {
    display: none;
}
</style>
