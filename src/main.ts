import "./style.css";
import { createCoreScene } from "./core/scene";
import { enablePhysics } from "./core/physics";
import { createGround } from "./core/ground";

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const { engine, scene } = createCoreScene(canvas);

  await enablePhysics(scene);
  createGround(scene);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

void bootstrap();
