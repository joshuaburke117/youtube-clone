'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WatchInner() {
    const videoPrefix = 'https://storage.googleapis.com/jb117-yt-processed-videos/';
    const videoSrc = useSearchParams().get('v');

    return (
        <div>
            <h1>Watch Page</h1>
            <video controls src={videoPrefix + videoSrc} />
        </div>
    );
}

export default function Watch() {
    return (
        <Suspense fallback={<div>Loading video...</div>}>
            <WatchInner />
        </Suspense>
    );
}
