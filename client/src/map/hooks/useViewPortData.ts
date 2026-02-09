import { useState, useRef, useCallback } from "react";
import { Bounds, Viewport, UseViewportDataOptions } from "../../types/MapTypes";


export function useViewportData<T>({
    minZoom = 0,
    debounceMs = 300,
    onFetch,
    onClear,
}: UseViewportDataOptions<T>) {
    const [data, setData] = useState<T | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastViewportRef = useRef<Viewport | null>(null);

    const handleViewportChange = useCallback((viewport: Viewport) => {
        // Zoom gating
        if (viewport.zoom < minZoom) {
            onClear?.();
            setData(null);
            return;
        }

        lastViewportRef.current = viewport;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const vp = lastViewportRef.current!;
            onFetch(vp).then(setData).catch((err) => {
                console.error("useViewportData fetch error:", err);
            });
        }, debounceMs);
    }, [minZoom, debounceMs, onFetch, onClear]);

    return { data, handleViewportChange };
}