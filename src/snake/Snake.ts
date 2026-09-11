import { BallAndSocketConstraint, Vector3, type Scene } from "@babylonjs/core";
import { SEGMENT_SIZE, SnakeSegment } from "./SnakeSegment";
import { SEGMENT_COLORS } from "./segmentColors";

const HALF_WIDTH = SEGMENT_SIZE.width / 2;

export class Snake {
  public readonly segments: readonly SnakeSegment[];
  private readonly constraints: (BallAndSocketConstraint | undefined)[];

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

    this.constraints = segments.slice(0, -1).map((segment, i) => {
      const bodyA = segment.aggregate.body;
      const bodyB = segments[i + 1]!.aggregate.body;
      const constraint = new BallAndSocketConstraint(
        new Vector3(HALF_WIDTH, 0, 0),
        new Vector3(-HALF_WIDTH, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 1, 0),
        scene,
      );
      bodyA.addConstraint(bodyB, constraint);
      return constraint;
    });
  }

  /** Detaches a segment from its neighbors, used right before it is destroyed. */
  public detachSegment(index: number): void {
    this.constraints[index - 1]?.dispose();
    this.constraints[index - 1] = undefined;
    this.constraints[index]?.dispose();
    this.constraints[index] = undefined;
  }

  public dispose(): void {
    for (const constraint of this.constraints) {
      constraint?.dispose();
    }
    for (const segment of this.segments) {
      segment.dispose();
    }
  }
}
