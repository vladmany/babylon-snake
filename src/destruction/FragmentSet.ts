import {
  Color3,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  Quaternion,
  StandardMaterial,
  Vector3,
  type Scene,
} from "@babylonjs/core";
import { CollisionGroup } from "../snake/types";
import { SEGMENT_SIZE } from "../snake/SnakeSegment";

const SHARD_GRID = { x: 2, y: 2, z: 2 } as const;
const SHARD_GAP_SCALE = 0.85;
const SCATTER_IMPULSE_MIN = 0.8;
const SCATTER_IMPULSE_MAX = 2;

interface Shard {
  mesh: Mesh;
  aggregate: PhysicsAggregate;
  localOffset: Vector3;
}

/** A pre-built, initially hidden set of small shards standing in for one destroyed snake segment. */
export class FragmentSet {
  private readonly shards: Shard[] = [];
  private readonly scratchOffset = new Vector3();
  private readonly scratchPosition = new Vector3();
  private readonly scratchImpulse = new Vector3();

  constructor(scene: Scene, id: string, color: Color3) {
    const shardWidth = (SEGMENT_SIZE.width / SHARD_GRID.x) * SHARD_GAP_SCALE;
    const shardHeight = (SEGMENT_SIZE.height / SHARD_GRID.y) * SHARD_GAP_SCALE;
    const shardDepth = (SEGMENT_SIZE.depth / SHARD_GRID.z) * SHARD_GAP_SCALE;

    const material = new StandardMaterial(`fragment-${id}-material`, scene);
    material.diffuseColor = color;

    for (let ix = 0; ix < SHARD_GRID.x; ix++) {
      for (let iy = 0; iy < SHARD_GRID.y; iy++) {
        for (let iz = 0; iz < SHARD_GRID.z; iz++) {
          const mesh = MeshBuilder.CreateBox(
            `fragment-${id}-${ix}${iy}${iz}`,
            { width: shardWidth, height: shardHeight, depth: shardDepth },
            scene,
          );
          mesh.material = material;
          mesh.isPickable = false;
          mesh.setEnabled(false);

          const localOffset = new Vector3(
            (ix + 0.5) * (SEGMENT_SIZE.width / SHARD_GRID.x) - SEGMENT_SIZE.width / 2,
            (iy + 0.5) * (SEGMENT_SIZE.height / SHARD_GRID.y) - SEGMENT_SIZE.height / 2,
            (iz + 0.5) * (SEGMENT_SIZE.depth / SHARD_GRID.z) - SEGMENT_SIZE.depth / 2,
          );

          const aggregate = new PhysicsAggregate(
            mesh,
            PhysicsShapeType.BOX,
            { mass: 0.15, friction: 0.4, restitution: 0.25 },
            scene,
          );
          aggregate.shape.filterMembershipMask = CollisionGroup.SNAKE;
          aggregate.shape.filterCollideMask = CollisionGroup.GROUND;
          aggregate.body.setMotionType(PhysicsMotionType.STATIC);

          this.shards.push({ mesh, aggregate, localOffset });
        }
      }
    }
  }

  public activate(position: Vector3, rotation: Quaternion): void {
    for (const shard of this.shards) {
      const body = shard.aggregate.body;

      shard.localOffset.rotateByQuaternionToRef(rotation, this.scratchOffset);
      position.addToRef(this.scratchOffset, this.scratchPosition);

      body.disablePreStep = false;
      shard.mesh.setEnabled(true);
      shard.mesh.rotationQuaternion = rotation.clone();
      shard.mesh.position.copyFrom(this.scratchPosition);
      body.disablePreStep = true;

      body.setMotionType(PhysicsMotionType.DYNAMIC);
      body.setLinearVelocity(Vector3.Zero());
      body.setAngularVelocity(Vector3.Zero());

      if (this.scratchOffset.lengthSquared() > 1e-6) {
        this.scratchOffset.normalize();
      } else {
        this.scratchOffset.set(Math.random() - 0.5, Math.random(), Math.random() - 0.5);
      }
      const magnitude =
        SCATTER_IMPULSE_MIN + Math.random() * (SCATTER_IMPULSE_MAX - SCATTER_IMPULSE_MIN);
      this.scratchImpulse.copyFrom(this.scratchOffset).scaleInPlace(magnitude);
      body.applyImpulse(this.scratchImpulse, shard.mesh.getAbsolutePosition());
    }
  }
}
