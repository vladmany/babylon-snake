import "./style.css";
import { createCoreScene } from "./core/scene";
import { enablePhysics } from "./core/physics";
import { createGround } from "./core/ground";
import { Snake } from "./snake/Snake";
import { SnakeDragController } from "./snake/SnakeDragController";
import { SEGMENT_COLORS } from "./snake/segmentColors";
import { FragmentPool } from "./destruction/FragmentPool";
import { SegmentDestructionSystem } from "./destruction/SegmentDestructionSystem";

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const { engine, scene } = createCoreScene(canvas);

  await enablePhysics(scene);
  createGround(scene);

  const snake = new Snake(scene);
  new SnakeDragController(snake.segments);

  const segmentIds = snake.segments.map((segment) => segment.id);
  const fragmentPool = new FragmentPool(scene, segmentIds, SEGMENT_COLORS);
  new SegmentDestructionSystem(snake, fragmentPool);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

void bootstrap();
