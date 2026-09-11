import "./style.css";
import { createCoreScene } from "./core/scene";
import { enablePhysics } from "./core/physics";
import { createGround } from "./core/ground";
import { Snake } from "./snake/Snake";
import { SnakeDragController } from "./snake/SnakeDragController";

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const { engine, scene } = createCoreScene(canvas);

  await enablePhysics(scene);
  createGround(scene);
  const snake = new Snake(scene);
  new SnakeDragController(snake.segments);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

void bootstrap();
