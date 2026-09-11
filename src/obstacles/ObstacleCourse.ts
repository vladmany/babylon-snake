import { Color3, Ray, RayHelper, Vector3, type Scene } from "@babylonjs/core";
import type { Snake } from "../snake/Snake";
import type { SegmentDestructionSystem } from "../destruction/SegmentDestructionSystem";

export interface ObstacleBeamDefinition {
  origin: Vector3;
  direction: Vector3;
  length: number;
}

const RAY_COLOR = new Color3(1, 0.15, 0.2);

/** Static laser trip-wires: any snake segment that crosses a beam gets destroyed. */
export class ObstacleCourse {
  private readonly rays: readonly Ray[];

  constructor(scene: Scene, snake: Snake, destructionSystem: SegmentDestructionSystem, beams: readonly ObstacleBeamDefinition[]) {
    this.rays = beams.map((beam) => {
      const ray = new Ray(beam.origin, beam.direction.normalizeToNew(), beam.length);
      RayHelper.CreateAndShow(ray, scene, RAY_COLOR);
      return ray;
    });

    scene.onBeforeRenderObservable.add(() => {
      snake.segments.forEach((segment, index) => {
        if (destructionSystem.isDestroyed(index)) return;
        for (const ray of this.rays) {
          if (ray.intersectsMesh(segment.mesh, true).hit) {
            destructionSystem.destroySegment(index);
            return;
          }
        }
      });
    });
  }
}
