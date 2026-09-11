import type { Color3, Quaternion, Scene, Vector3 } from "@babylonjs/core";
import { FragmentSet } from "./FragmentSet";

/** Pre-builds one hidden FragmentSet per snake segment so nothing is created at runtime. */
export class FragmentPool {
  private readonly sets: readonly FragmentSet[];

  constructor(scene: Scene, ids: readonly string[], colors: readonly Color3[]) {
    this.sets = ids.map((id, index) => new FragmentSet(scene, id, colors[index]!));
  }

  public activate(index: number, position: Vector3, rotation: Quaternion): void {
    this.sets[index]?.activate(position, rotation);
  }
}
