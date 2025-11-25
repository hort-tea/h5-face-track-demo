export function openImageDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("h5-face-track", 1);
        req.onerror = () => reject(req.error);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "key" });
            }
        };
        req.onsuccess = () => resolve(req.result);
    });
}

export async function putImage(key: string, blob: Blob): Promise<void> {
    const db = await openImageDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        const store = tx.objectStore("images");
        const req = store.put({ key, blob, createdAt: Date.now() });
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getImage(key: string): Promise<Blob | null> {
    const db = await openImageDB();
    return await new Promise<Blob | null>((resolve, reject) => {
        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const req = store.get(key);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
            const val: any = req.result;
            resolve(val && val.blob ? (val.blob as Blob) : null);
        };
    });
}
