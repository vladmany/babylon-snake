import { PointerDragBehavior } from "@babylonjs/core";
import { SEGMENT_SIZE, type SnakeSegment } from "./SnakeSegment";

const GROUND_SURFACE_Y = 0;
const MIN_SEGMENT_Y = GROUND_SURFACE_Y + SEGMENT_SIZE.height / 2;

export class SnakeDragController {
  private readonly behaviors: PointerDragBehavior[] = [];

  constructor(segments: readonly SnakeSegment[]) {
    for (const segment of segments) {
      const behavior = new PointerDragBehavior();
      const body = segment.aggregate.body;

      behavior.validateDrag = (target) => target.y >= MIN_SEGMENT_Y;

      behavior.onDragStartObservable.add(() => {
        body.disablePreStep = false;
      });
      behavior.onDragEndObservable.add(() => {
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
