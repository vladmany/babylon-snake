import { AdvancedDynamicTexture } from "@babylonjs/gui";

export function createFullscreenGui(): AdvancedDynamicTexture {
  return AdvancedDynamicTexture.CreateFullscreenUI("UI");
}
