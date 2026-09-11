import "./style.css";
import { Vector3 } from "@babylonjs/core";
import { createCoreScene } from "./core/scene";
import { enablePhysics } from "./core/physics";
import { createGround } from "./core/ground";
import { Snake } from "./snake/Snake";
import { SnakeDragController } from "./snake/SnakeDragController";
import { SEGMENT_COLORS } from "./snake/segmentColors";
import { FragmentPool } from "./destruction/FragmentPool";
import { SegmentDestructionSystem } from "./destruction/SegmentDestructionSystem";
import { ObstacleCourse, type ObstacleBeamDefinition } from "./obstacles/ObstacleCourse";
import { FinishZone } from "./obstacles/FinishZone";
import { DustPool } from "./particles/DustPool";
import { GroundContactDust } from "./particles/GroundContactDust";
import dustTextureUrl from "./assets/textures/dust-particle.png";

const OBSTACLE_BEAMS: readonly ObstacleBeamDefinition[] = [
  { origin: new Vector3(-4, 0.55, -15), direction: new Vector3(0, 0, 1), length: 18 },
  { origin: new Vector3(-1, 0.55, -3), direction: new Vector3(0, 0, 1), length: 18 },
  { origin: new Vector3(2, 0.55, -15), direction: new Vector3(0, 0, 1), length: 18 },
  { origin: new Vector3(5, 0.55, -3), direction: new Vector3(0, 0, 1), length: 18 },
];

const FINISH_POSITION = new Vector3(11, 1.25, 0);
const SNAKE_START_POSITION = new Vector3(-10, 3, 0);

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const { engine, scene } = createCoreScene(canvas);

  const physicsPlugin = await enablePhysics(scene);
  createGround(scene);

  const snake = new Snake(scene, 4, SNAKE_START_POSITION);
  new SnakeDragController(snake.segments);

  const dustPool = new DustPool(scene, dustTextureUrl);
  new GroundContactDust(snake, dustPool);

  const segmentIds = snake.segments.map((segment) => segment.id);
  const fragmentPool = new FragmentPool(scene, segmentIds, SEGMENT_COLORS);
  const destructionSystem = new SegmentDestructionSystem(snake, fragmentPool, (_index, position) =>
    dustPool.emitAt(position),
  );

  new ObstacleCourse(scene, snake, destructionSystem, OBSTACLE_BEAMS);
  new FinishZone(scene, physicsPlugin, snake, FINISH_POSITION, () => {
    alert("Поздравляем! Змейка добралась до финиша!");
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

void bootstrap();
