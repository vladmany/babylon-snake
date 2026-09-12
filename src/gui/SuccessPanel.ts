import { Button, Control, Rectangle, StackPanel, TextBlock, type AdvancedDynamicTexture } from "@babylonjs/gui";

/** Hidden congratulations overlay shown instead of a blocking alert on finish. */
export class SuccessPanel {
  private readonly overlay: Rectangle;

  constructor(adt: AdvancedDynamicTexture, onRestart: () => void) {
    const overlay = new Rectangle("success-overlay");
    overlay.width = 1;
    overlay.height = 1;
    overlay.thickness = 0;
    overlay.background = "rgba(0, 0, 0, 0.65)";
    overlay.isVisible = false;
    adt.addControl(overlay);

    const panel = new StackPanel("success-panel");
    panel.width = "360px";
    panel.isVertical = true;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.spacing = 12;
    overlay.addControl(panel);

    const title = new TextBlock("success-title", "Поздравляем!");
    title.color = "white";
    title.fontSize = 32;
    title.height = "48px";
    panel.addControl(title);

    const message = new TextBlock("success-message", "Змейка добралась до финиша.");
    message.color = "white";
    message.fontSize = 18;
    message.height = "28px";
    message.textWrapping = true;
    panel.addControl(message);

    const restartButton = Button.CreateSimpleButton("restart-button", "Играть ещё раз");
    restartButton.height = "44px";
    restartButton.color = "white";
    restartButton.background = "#2f8f3f";
    restartButton.cornerRadius = 6;
    restartButton.paddingTop = "8px";
    restartButton.onPointerClickObservable.add(() => onRestart());
    panel.addControl(restartButton);

    this.overlay = overlay;
  }

  public show(): void {
    this.overlay.isVisible = true;
  }
}
