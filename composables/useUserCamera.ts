export function useUserCamera(mode: "user" | "environment") {
    mode = mode || "user";
    return useUserMedia({
        constraints: { video: { facingMode: mode }, audio: false },
    });
}
