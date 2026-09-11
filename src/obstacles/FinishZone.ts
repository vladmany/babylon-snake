import {
  Color3,
  HavokPlugin,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsEventType,
  PhysicsShapeType,
  StandardMaterial,
  type Scene,
  type Vector3,
} from "@babylonjs/core";
import { CollisionGroup } from "../snake/types";
import type { Snake } from "../snake/Snake";

const FINISH_SIZE = 2.5;

/** Semi-transparent green trigger zone; fires a callback once any snake segment enters it. */
export class FinishZone {
  constructor(
    scene: Scene,
    plugin: HavokPlugin,
    snake: Snake,
    position: Vector3,
    onReached: () => void,
  ) {
    const mesh = MeshBuilder.CreateBox("finish-zone", { size: FINISH_SIZE }, scene);
    mesh.position.copyFrom(position);
    mesh.isPickable = false;

    const material = new StandardMaterial("finish-zone-material", scene);
    material.diffuseColor = new Color3(0.1, 0.85, 0.2);
    material.alpha = 0.5;
    mesh.material = material;

    const aggregate = new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, scene);
    aggregate.shape.isTrigger = true;
    aggregate.shape.filterMembershipMask = CollisionGroup.GROUND;
    aggregate.shape.filterCollideMask = CollisionGroup.SNAKE;

    const zoneBody = aggregate.body;
    const segmentBodies = new Set(snake.segments.map((segment) => segment.aggregate.body));
    let reached = false;

    plugin.onTriggerCollisionObservable.add((event) => {
      if (reached || event.type !== PhysicsEventType.TRIGGER_ENTERED) return;
      if (event.collider !== zoneBody && event.collidedAgainst !== zoneBody) return;

      const other = event.collider === zoneBody ? event.collidedAgainst : event.collider;
      if (!segmentBodies.has(other)) return;

      reached = true;
      onReached();
    });
  }
}
