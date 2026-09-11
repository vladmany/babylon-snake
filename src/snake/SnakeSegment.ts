import {
  Color3,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  StandardMaterial,
  type Scene,
} from "@babylonjs/core";
import { CollisionGroup, type SegmentMetadata } from "./types";

export const SEGMENT_SIZE = { width: 1.4, height: 0.8, depth: 0.8 } as const;

export class SnakeSegment {
  public readonly mesh: Mesh;
  public readonly aggregate: PhysicsAggregate;
  public readonly material: StandardMaterial;

  constructor(
    scene: Scene,
    id: string,
    position: { x: number; y: number; z: number },
    color: Color3,
  ) {
    this.mesh = MeshBuilder.CreateBox(
      `segment-${id}`,
      SEGMENT_SIZE,
      scene,
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.metadata = { id } satisfies SegmentMetadata;

    this.material = new StandardMaterial(`segment-${id}-material`, scene);
    this.material.diffuseColor = color;
    this.mesh.material = this.material;

    this.aggregate = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.BOX,
      { mass: 1, friction: 0.5, restitution: 0.1 },
      scene,
    );
    this.aggregate.shape.filterMembershipMask = CollisionGroup.SNAKE;
    this.aggregate.shape.filterCollideMask = CollisionGroup.GROUND;
  }

  public get id(): string {
    return (this.mesh.metadata as SegmentMetadata).id;
  }

  public dispose(): void {
    this.aggregate.dispose();
    this.mesh.dispose();
  }
}
