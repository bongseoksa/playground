"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const camContainerRef = useRef<TransformNode | null>(null);
  const camVerticalAxis = useRef(0);
  const camHorizontalAxis = useRef(0);

  /** 씬 화면 초기화 */
  const onSceneReady = useCallback(() => {
    if (!engineRef.current || !sceneRef.current) return;
    const { current: engine } = engineRef;
    const { current: scene } = sceneRef;

    engine.runRenderLoop(() => {
      scene.render();
    });

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50 },
      scene
    );

    const box = MeshBuilder.CreateBox("box", { size: 1.5 }, scene);
    box.position.set(0, -1, 0);

    const light = new HemisphericLight(
      "mainLight",
      new Vector3(0, 10, 0),
      scene
    );

    const cam = new FreeCamera("mainCam", new Vector3(0, 5, -10), scene);
    const camContainer = new TransformNode("cameraContainer", scene);
    camContainer.position = new Vector3(0, 15, 0);
    cam.parent = camContainer;
    cam.setTarget(ground.position);
    camContainerRef.current = camContainer;
  }, []);

  /** 엔진, 씬 생성 */
  const initScene = useCallback(() => {
    const engine = new Engine(canvasRef.current, true, {
      adaptToDeviceRatio: true,
    });
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    if (scene.isReady()) {
      onSceneReady();
    } else {
      scene.onReadyObservable.addOnce(onSceneReady);
    }
  }, [onSceneReady]);

  /** 씬 리사이즈 핸들러 */
  const resizeHandler = useCallback(() => {
    const { current: scene } = sceneRef;
    if (scene) scene.getEngine().resize();
  }, []);

  useEffect(() => {
    initScene();

    const keyDownHandler = (e: KeyboardEvent) => {
      const theKey = e.key.toLowerCase();
      if (theKey === "arrowup") camVerticalAxis.current = 1;
      if (theKey === "arrowdown") camVerticalAxis.current = -1;
      if (theKey === "arrowleft") camHorizontalAxis.current = -1;
      if (theKey === "arrowright") camHorizontalAxis.current = 1;

      if (camContainerRef.current) {
        camContainerRef.current.locallyTranslate(
          new Vector3(camHorizontalAxis.current, 0, camVerticalAxis.current)
        );
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      const theKey = e.key.toLowerCase();
      console.log("keyUpHandler", theKey);
      if (theKey === "arrowup") camVerticalAxis.current = 0;
      if (theKey === "arrowdown") camVerticalAxis.current = 0;
      if (theKey === "arrowleft") camHorizontalAxis.current = 0;
      if (theKey === "arrowright") camHorizontalAxis.current = 0;
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [initScene, resizeHandler]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <canvas
          className="fixed top-0 left-0 w-full h-full bg-white"
          ref={canvasRef}
        />
      </main>
    </div>
  );
}
