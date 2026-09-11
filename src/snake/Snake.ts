import { BallAndSocketConstraint, Color3, Vector3, type Scene } from "@babylonjs/core";
import { SEGMENT_SIZE, SnakeSegment } from "./SnakeSegment";

const SEGMENT_COLORS: readonly Color3[] = [
  new Color3(0.2, 0.7, 0.3),
  new Color3(0.85, 0.7, 0.15),
  new Color3(0.8, 0.35, 0.15),
  new Color3(0.75, 0.15, 0.2),
];

const HALF_WIDTH = SEGMENT_SIZE.width / 2;

export class Snake {
  public readonly segments: readonly SnakeSegment[];

  constructor(scene: Scene, segmentCount = 4, startPosition = new Vector3(0, 3, 0)) {
    const segments: SnakeSegment[] = [];
    for (let i = 0; i < segmentCount; i++) {
      const position = {
        x: startPosition.x + i * SEGMENT_SIZE.width,
        y: startPosition.y,
        z: startPosition.z,
      };
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]!;
      segments.push(new SnakeSegment(scene, `seg-${i}`, position, color));
    }
    this.segments = segments;

    for (let i = 0; i < segments.length - 1; i++) {
      const bodyA = segments[i]!.aggregate.body;
      const bodyB = segments[i + 1]!.aggregate.body;
      const constraint = new BallAndSocketConstraint(
        new Vector3(HALF_WIDTH, 0, 0),
        new Vector3(-HALF_WIDTH, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 1, 0),
        scene,
      );
      bodyA.addConstraint(bodyB, constraint);
    }
  }

  public dispose(): void {
    for (const segment of this.segments) {
      segment.dispose();
    }
  }
}
