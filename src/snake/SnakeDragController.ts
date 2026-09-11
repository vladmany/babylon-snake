import { PointerDragBehavior, Vector3 } from "@babylonjs/core";
import { SEGMENT_SIZE, type SnakeSegment } from "./SnakeSegment";

const GROUND_SURFACE_Y = 0;
const MIN_SEGMENT_Y = GROUND_SURFACE_Y + SEGMENT_SIZE.height / 2;

export class SnakeDragController {
  private readonly behaviors: PointerDragBehavior[] = [];

  constructor(segments: readonly SnakeSegment[]) {
    for (const segment of segments) {
      const behavior = new PointerDragBehavior();
      const body = segment.aggregate.body;

      behavior.validateDrag = (target) => {
        if (target.y < MIN_SEGMENT_Y) {
          target.y = MIN_SEGMENT_Y;
        }
        return true;
      };

      behavior.onDragStartObservable.add(() => {
        body.disablePreStep = false;
      });
      behavior.onDragEndObservable.add(() => {
        // The kinematic drag can leave the body with a large phantom velocity
        // (e.g. from sliding fast along the floor); drop it so release always
        // hands off to real physics from a standstill instead of a false impact.
        body.setLinearVelocity(Vector3.Zero());
        body.setAngularVelocity(Vector3.Zero());
        body.disablePreStep = true;
      });

      segment.mesh.addBehavior(behavior);
      this.behaviors.push(behavior);
    }
  }

  public dispose(): void {
    for (const behavior of this.behaviors) {
      behavior.onDragStartObservable.clear();
      behavior.onDragEndObservable.clear();
    }
  }
}
