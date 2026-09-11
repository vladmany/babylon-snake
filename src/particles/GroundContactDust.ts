import { PhysicsEventType } from "@babylonjs/core";
import type { Snake } from "../snake/Snake";
import type { DustPool } from "./DustPool";

/** Spawns a pooled dust puff wherever a snake segment first touches the ground. */
export class GroundContactDust {
  constructor(snake: Snake, dustPool: DustPool) {
    for (const segment of snake.segments) {
      const body = segment.aggregate.body;
      body.setCollisionCallbackEnabled(true);
      body.getCollisionObservable().add((event) => {
        if (event.type !== PhysicsEventType.COLLISION_STARTED) return;
        dustPool.emitAt(event.point ?? segment.mesh.getAbsolutePosition());
      });
    }
  }
}
