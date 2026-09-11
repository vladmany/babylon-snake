import { Color4, ParticleSystem, Texture, Vector3, type Scene } from "@babylonjs/core";

export function createDustParticleSystem(
  scene: Scene,
  name: string,
  textureUrl: string,
  emitter: Vector3,
): ParticleSystem {
  const system = new ParticleSystem(name, 120, scene);
  system.particleTexture = new Texture(textureUrl, scene);
  system.emitter = emitter;
  system.minEmitBox = new Vector3(-0.2, 0, -0.2);
  system.maxEmitBox = new Vector3(0.2, 0, 0.2);

  system.color1 = new Color4(0.55, 0.5, 0.42, 0.55);
  system.color2 = new Color4(0.65, 0.6, 0.5, 0.35);
  system.colorDead = new Color4(0.5, 0.45, 0.4, 0);

  system.minSize = 0.15;
  system.maxSize = 0.5;
  system.minLifeTime = 0.25;
  system.maxLifeTime = 0.6;

  system.emitRate = 80;
  system.blendMode = ParticleSystem.BLENDMODE_STANDARD;
  system.gravity = new Vector3(0, -1.5, 0);
  system.direction1 = new Vector3(-1, 1.5, -1);
  system.direction2 = new Vector3(1, 2.5, 1);
  system.minEmitPower = 0.4;
  system.maxEmitPower = 1.2;
  system.updateSpeed = 0.01;

  return system;
}
