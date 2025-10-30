import type { AxiosRequestConfig } from "axios";
import { upload } from "./http";
import type { FaceSimilarityResponse } from "../types/face";
import type { FaceSimilarityPayload } from "../types/face";
export function faceSimilarityByBase64(
    payload: FaceSimilarityPayload,
    config?: AxiosRequestConfig
) {
    const form = new FormData();
    form.append("image1", payload.image1);
    form.append("image2", payload.image2);
    return upload<FaceSimilarityResponse>(
        "/face-similarity.php",
        form,
        undefined,
        config
    );
}
