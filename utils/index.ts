const AGE_RANGE = [16, 60];
// 检查年龄是否在范围内
export const checkAgeRange = (age: number) => {
    if (age < AGE_RANGE[0] || age > AGE_RANGE[1]) {
        return false;
    }
    return true;
};
