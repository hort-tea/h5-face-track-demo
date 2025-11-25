import type { AxiosRequestConfig } from "axios";
import { upload } from "./http";
import type { FaceSimilarityResponse } from "../types/face";
import type { FaceSimilarityPayload } from "../types/face";
// token 換取信息
export function check_token(
    payload: { token: string },
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("token", payload.token || "");
    return upload<any>(
        "/face_similarity/check_token.php",
        form,
        undefined,
        config
    );
}
export function faceSimilarityByBase64(
    payload: FaceSimilarityPayload,
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("token", localStorage.getItem("token") || "");
    form.append("image1", payload.image1);
    form.append("image2", payload.image2);
    form.append("idcard", payload.idcard);
    return upload<FaceSimilarityResponse>(
        "/face_similarity/face-similarity.php",
        form,
        undefined,
        config
    );
}

export function faceVerifyStep1(
    file: File | Blob | null,
    identity: string,
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("step", "1");
    form.append("token", localStorage.getItem("token") || "");
    if (file) {
        form.append("photo", file, "cropped.jpg");
    }
    form.append("identity", identity);
    return upload<any>(
        "/face_similarity/face_verify.php",
        form,
        undefined,
        config
    );
}

export function faceVerifyStep2(
    xcpic: File | Blob,
    identity: string,
    photoPath: string,
    log_data: string,
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("step", "2");
    form.append("xcpic", xcpic, "xcpic.jpg");
    form.append("identity", identity);
    form.append("photo_path", photoPath);
    form.append("log_data", log_data);
    form.append("token", localStorage.getItem("token") || "");
    return upload<any>(
        "/face_similarity/face_verify.php",
        form,
        undefined,
        config
    );
}

export function faceVerifyStep3(
    sign: File | Blob,
    identity: string,
    faceMatchScore: number,
    photoPath: string,
    xcpicPath: string,
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("step", "3");
    form.append("sign", sign, "sign.png");
    form.append("identity", identity);
    form.append("face_match_score", String(faceMatchScore));
    form.append("photo_path", photoPath);
    form.append("xcpic_path", xcpicPath);
    form.append("token", localStorage.getItem("token") || "");
    return upload<any>(
        "/face_similarity/face_verify.php",
        form,
        undefined,
        config
    );
}
