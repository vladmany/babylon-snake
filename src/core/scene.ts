import {
  ArcRotateCamera,
  Color4,
  Engine,
  HemisphericLight,
  Scene,
  Vector3,
} from "@babylonjs/core";

export interface CoreScene {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera;
}

export function createCoreScene(canvas: HTMLCanvasElement): CoreScene {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.06, 0.06, 0.08, 1);

  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2.3,
    Math.PI / 3,
    22,
    new Vector3(0, 0, 0),
    scene,
  );
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 40;
  camera.wheelPrecision = 30;
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(0.3, 1, 0.2), scene);
  light.intensity = 0.9;

  return { engine, scene, camera };
}
