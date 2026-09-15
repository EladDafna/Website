"use client";

import dynamic from "next/dynamic";

/**
 * WebGL cannot render on the server, so the scene is loaded on the client only.
 * Until it arrives the page still has the CSS aurora behind it, so there is no
 * visible gap.
 */
const SpaceScene = dynamic(() => import("@/components/scene/SpaceScene"), {
  ssr: false,
  loading: () => null,
});

export default function SceneMount() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <SpaceScene />
    </div>
  );
}
