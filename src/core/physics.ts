import { HavokPlugin, Vector3, type Scene } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import havokWasmUrl from "@babylonjs/havok/lib/esm/HavokPhysics.wasm?url";

const GRAVITY = new Vector3(0, -9.81, 0);

export async function enablePhysics(scene: Scene): Promise<HavokPlugin> {
  const havokInstance = await HavokPhysics({ locateFile: () => havokWasmUrl });
  const plugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(GRAVITY, plugin);
  return plugin;
}
