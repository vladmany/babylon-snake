import { Vector3, type ParticleSystem, type Scene } from "@babylonjs/core";
import { createDustParticleSystem } from "./createDustParticleSystem";

const POOL_SIZE = 8;
const EMIT_DURATION_MS = 150;

/** Pre-built, idle particle systems reused for every dust puff instead of creating one at runtime. */
export class DustPool {
  private readonly systems: readonly ParticleSystem[];
  private readonly emitters: readonly Vector3[];
  private nextIndex = 0;

  constructor(scene: Scene, textureUrl: string) {
    const systems: ParticleSystem[] = [];
    const emitters: Vector3[] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const emitter = new Vector3();
      systems.push(createDustParticleSystem(scene, `dust-${i}`, textureUrl, emitter));
      emitters.push(emitter);
    }
    this.systems = systems;
    this.emitters = emitters;
  }

  public emitAt(position: Vector3): void {
    const index = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % this.systems.length;

    this.emitters[index]!.copyFrom(position);
    const system = this.systems[index]!;
    system.start();
    setTimeout(() => system.stop(), EMIT_DURATION_MS);
  }
}
