import { PhysicsEventType, PhysicsMotionType, Quaternion, type Vector3 } from "@babylonjs/core";
import type { Snake } from "../snake/Snake";
import type { FragmentPool } from "./FragmentPool";

const IMPACT_IMPULSE_THRESHOLD = 6;

export type SegmentDestroyedHandler = (index: number, position: Vector3) => void;

/** Watches each snake segment's ground impacts and swaps hard-hit segments for pooled shards. */
export class SegmentDestructionSystem {
  private readonly snake: Snake;
  private readonly fragmentPool: FragmentPool;
  private readonly onSegmentDestroyed: SegmentDestroyedHandler | undefined;
  private readonly onAllSegmentsDestroyed: (() => void) | undefined;
  private readonly destroyed: boolean[];

  constructor(
    snake: Snake,
    fragmentPool: FragmentPool,
    onSegmentDestroyed?: SegmentDestroyedHandler,
    onAllSegmentsDestroyed?: () => void,
  ) {
    this.snake = snake;
    this.fragmentPool = fragmentPool;
    this.onSegmentDestroyed = onSegmentDestroyed;
    this.onAllSegmentsDestroyed = onAllSegmentsDestroyed;
    this.destroyed = snake.segments.map(() => false);

    snake.segments.forEach((segment, index) => {
      const body = segment.aggregate.body;
      body.setCollisionCallbackEnabled(true);
      body.getCollisionObservable().add((event) => {
        if (this.destroyed[index]) return;
        if (body.disablePreStep === false) return; // segment is being held by the player
        if (event.type !== PhysicsEventType.COLLISION_STARTED) return;
        if (event.impulse < IMPACT_IMPULSE_THRESHOLD) return;
        this.destroy(index, event.point);
      });
    });
  }

  public isDestroyed(index: number): boolean {
    return this.destroyed[index] ?? false;
  }

  /** External trigger (e.g. an obstacle ray) for destroying a segment outright. */
  public destroySegment(index: number): void {
    if (this.destroyed[index]) return;
    this.destroy(index, null);
  }

  private destroy(index: number, point: Vector3 | null): void {
    this.destroyed[index] = true;
    const segment = this.snake.segments[index]!;
    const worldPosition = segment.mesh.getAbsolutePosition().clone();
    const worldRotation = (segment.mesh.rotationQuaternion ?? Quaternion.Identity()).clone();

    this.snake.detachSegment(index);
    segment.mesh.setEnabled(false);
    segment.aggregate.body.setCollisionCallbackEnabled(false);
    segment.aggregate.body.setMotionType(PhysicsMotionType.STATIC);

    this.fragmentPool.activate(index, worldPosition, worldRotation);
    this.onSegmentDestroyed?.(index, point ?? worldPosition);

    if (this.destroyed.every(Boolean)) {
      this.onAllSegmentsDestroyed?.();
    }
  }
}
