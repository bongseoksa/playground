"use client";
import { useRef } from "react";
import CanvasView from "@/components/canvasView";
import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onRender = (scene: Scene) => {
    // console.log("onRender", scene);
  };

  const onSceneReady = (scene: Scene) => {
    console.log("onSceneReady", scene);
    const light = new HemisphericLight(
      "mainLight",
      new Vector3(0, 10, 0),
      scene
    );
    const cam = new FreeCamera("mainCam", new Vector3(0, 1, -5), scene);

    const box = MeshBuilder.CreateBox("box", { width: 3 }, scene);
    box.position.set(-1, 0, 0);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CanvasView
          ref={canvasRef}
          onRender={onRender}
          onSceneReady={onSceneReady}
        />
      </main>
    </div>
  );
}
