import axios from "axios";
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";

// 统一的返回类型（可根据后端约定调整）
export interface ApiResponse<T = any> {
    code?: number | string;
    message?: string;
    data?: T;
    [key: string]: any;
}

export interface ApiError {
    status: number;
    code?: string | number;
    message: string;
    details?: any;
}
// 默认使用 Nuxt 开发代理：开发环境走 "/api"，其他环境走真实后端

// 创建 Axios 实例
const http: AxiosInstance = axios.create({
    // baseURL: "http://10.0.10.80",
    baseURL: "https://10.0.10.80/faces",
    // baseURL: "http://192.168.100.246",
    timeout: 15000000,
    headers: {
        Accept: "application/json",
    },
    withCredentials: false,
});

// 可选：设置认证令牌（如有需要）
export function setAuthToken(token: string | null) {
    if (token) {
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete http.defaults.headers.common["Authorization"];
    }
}

// 请求拦截器：可统一添加 headers
http.interceptors.request.use((config) => {
    // 示例：添加简单的请求 ID
    config.headers = config.headers || {};
    // 示例：从本地获取 token（仅在客户端环境），按需启用
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

// 响应拦截器：统一错误处理并按需拆包
http.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const payload = response.data;
        // 如果后端约定 { code, message, data }，优先返回 data
        if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
            return payload.data as any;
        }
        // 否则返回完整 payload
        return payload as any;
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            status: error.response?.status || 0,
            code: (error.response?.data as any)?.code,
            message:
                (error.response?.data as any)?.message ||
                error.message ||
                "Network Error",
            details: error.response?.data,
        };
        return Promise.reject(apiError);
    }
);

// 常用方法封装（保持类型友好）
export async function get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
) {
    return http.get<T>(url, { params, ...(config || {}) });
}

export async function post<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
) {
    return http.post<T>(url, body, config);
}

export async function put<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
) {
    return http.put<T>(url, body, config);
}

export async function patch<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
) {
    return http.patch<T>(url, body, config);
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.delete<T>(url, config);
}

// 文件上传（FormData），支持附加字段
export async function upload<T = any>(
    url: string,
    fileOrForm: File | Blob | FormData,
    extraFields?: Record<string, any>,
    config?: AxiosRequestConfig
) {
    const form = fileOrForm instanceof FormData ? fileOrForm : new FormData();
    if (!(fileOrForm instanceof FormData)) {
        const file = fileOrForm as File | Blob;
        form.append("file", file);
    }
    if (extraFields) {
        Object.entries(extraFields).forEach(([k, v]) =>
            form.append(k, v as any)
        );
    }
    // 不手动设置 Content-Type，浏览器会为 FormData 自动附带带 boundary 的 multipart/form-data
    const cfg = { ...(config || {}) };
    if (cfg.headers && "Content-Type" in cfg.headers) {
        const { ["Content-Type"]: _ignored, ...rest } = cfg.headers as any;
        cfg.headers = rest;
    }
    return http.post<T>(url, form, cfg);
}

// 文件下载（Blob）
export async function download(url: string, config?: AxiosRequestConfig) {
    return http.get<Blob>(url, { responseType: "blob", ...(config || {}) });
}

export default http;
