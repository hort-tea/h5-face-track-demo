let BASE_URL = "";
if (process.env.NODE_ENV === "production") {
    BASE_URL = "/faces";
} else {
    BASE_URL = "/faces_test";
}
export { BASE_URL };
