import { Button, Control, Rectangle, StackPanel, TextBlock, type AdvancedDynamicTexture } from "@babylonjs/gui";

export interface EndGameOverlayText {
  title: string;
  message: string;
}

/** Hidden full-screen overlay (win or loss) with a title, message, and restart button. */
export class EndGameOverlay {
  private readonly overlay: Rectangle;
  private readonly title: TextBlock;
  private readonly message: TextBlock;

  constructor(adt: AdvancedDynamicTexture, name: string, onRestart: () => void) {
    const overlay = new Rectangle(`${name}-overlay`);
    overlay.width = 1;
    overlay.height = 1;
    overlay.thickness = 0;
    overlay.background = "rgba(0, 0, 0, 0.65)";
    overlay.isVisible = false;
    adt.addControl(overlay);

    const panel = new StackPanel(`${name}-panel`);
    panel.width = "420px";
    panel.isVertical = true;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.spacing = 12;
    overlay.addControl(panel);

    this.title = new TextBlock(`${name}-title`);
    this.title.color = "white";
    this.title.fontSize = 32;
    this.title.height = "48px";
    panel.addControl(this.title);

    this.message = new TextBlock(`${name}-message`);
    this.message.color = "white";
    this.message.fontSize = 18;
    this.message.height = "52px";
    this.message.textWrapping = true;
    panel.addControl(this.message);

    const restartButton = Button.CreateSimpleButton(`${name}-restart-button`, "Играть ещё раз");
    restartButton.height = "44px";
    restartButton.color = "white";
    restartButton.background = "#2f8f3f";
    restartButton.cornerRadius = 6;
    restartButton.paddingTop = "8px";
    restartButton.onPointerClickObservable.add(() => onRestart());
    panel.addControl(restartButton);

    this.overlay = overlay;
  }

  public show(text: EndGameOverlayText): void {
    this.title.text = text.title;
    this.message.text = text.message;
    this.overlay.isVisible = true;
  }
}
