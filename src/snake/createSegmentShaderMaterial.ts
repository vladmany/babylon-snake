import { ShaderMaterial, type Color3, type Scene } from "@babylonjs/core";

const VERTEX_SOURCE = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 worldViewProjection;
  varying vec2 vUV;
  void main(void) {
    vUV = uv;
    gl_Position = worldViewProjection * vec4(position, 1.0);
  }
`;

const FRAGMENT_SOURCE = `
  precision highp float;
  varying vec2 vUV;
  uniform vec3 baseColor;
  uniform float time;
  void main(void) {
    float wave = 0.55 + 0.45 * sin(time * 2.0 + vUV.x * 6.2831853);
    gl_FragColor = vec4(baseColor * wave, 1.0);
  }
`;

/**
 * Custom ShaderMaterial with a time uniform: a brightness wave sweeps across
 * the mesh every frame (via vUV.x) instead of a flat StandardMaterial color.
 * `baseColor` stays the per-segment identity color the GUI buttons recolor.
 */
export function createSegmentShaderMaterial(scene: Scene, name: string, color: Color3): ShaderMaterial {
  const material = new ShaderMaterial(
    name,
    scene,
    { vertexSource: VERTEX_SOURCE, fragmentSource: FRAGMENT_SOURCE },
    {
      attributes: ["position", "uv"],
      uniforms: ["worldViewProjection", "baseColor", "time"],
    },
  );
  material.setColor3("baseColor", color);
  material.setFloat("time", 0);

  scene.onBeforeRenderObservable.add(() => {
    material.setFloat("time", performance.now() / 1000);
  });

  return material;
}
