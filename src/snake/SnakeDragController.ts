import { PointerDragBehavior } from "@babylonjs/core";
import type { SnakeSegment } from "./SnakeSegment";

export class SnakeDragController {
  private readonly behaviors: PointerDragBehavior[] = [];

  constructor(segments: readonly SnakeSegment[]) {
    for (const segment of segments) {
      const behavior = new PointerDragBehavior();
      const body = segment.aggregate.body;

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
