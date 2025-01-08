import React, { useEffect, useRef } from "react";
import { Scene, Engine, EngineOptions, SceneOptions } from "@babylonjs/core";

type CanvasViewProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene) => void;
  onSceneReady: (scene: Scene) => void;
  //   [key: string]: unknown; //rest 옵션
};

function CanvasView({
  ref,
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}: CanvasViewProps) {
  useEffect(() => {
    const { current: canvas } = ref;
    if (!canvas) return;
    console.log("A");

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    const scene = new Scene(engine, sceneOptions);

    if (scene.isReady()) {
      // onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ref,
  ]);

  return (
    <canvas
      className="fixed top-0 left-0 w-full h-full bg-white"
      ref={ref}
      {...rest}
    ></canvas>
  );
}

export default CanvasView;
