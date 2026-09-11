import {
  Color3,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  StandardMaterial,
  type Scene,
} from "@babylonjs/core";
import { CollisionGroup } from "../snake/types";

const ARENA_SIZE = 30;

export interface Ground {
  mesh: import("@babylonjs/core").Mesh;
  aggregate: PhysicsAggregate;
}

export function createGround(scene: Scene): Ground {
  const mesh = MeshBuilder.CreateGround(
    "ground",
    { width: ARENA_SIZE, height: ARENA_SIZE },
    scene,
  );

  const material = new StandardMaterial("groundMaterial", scene);
  material.diffuseColor = new Color3(0.2, 0.22, 0.25);
  mesh.material = material;

  const aggregate = new PhysicsAggregate(
    mesh,
    PhysicsShapeType.BOX,
    { mass: 0, friction: 0.6, restitution: 0.1 },
    scene,
  );
  aggregate.shape.filterMembershipMask = CollisionGroup.GROUND;
  aggregate.shape.filterCollideMask = CollisionGroup.SNAKE;

  return { mesh, aggregate };
}
