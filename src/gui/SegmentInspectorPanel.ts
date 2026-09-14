import { ActionManager, Color3, ExecuteCodeAction, type Scene } from "@babylonjs/core";
import { Button, Control, StackPanel, TextBlock, type AdvancedDynamicTexture } from "@babylonjs/gui";
import type { SnakeSegment } from "../snake/SnakeSegment";

interface ColorOption {
  label: string;
  color: Color3;
}

const COLOR_OPTIONS: readonly ColorOption[] = [
  { label: "Фиолетовый", color: new Color3(0.55, 0.15, 0.85) },
  { label: "Бирюзовый", color: new Color3(0.1, 0.75, 0.75) },
];

const NO_SELECTION_LABEL = "—";

/** Click a segment to show its id; the color buttons then recolor whichever segment is shown. */
export class SegmentInspectorPanel {
  private readonly segmentsById: Map<string, SnakeSegment>;
  private readonly idText: TextBlock;
  private selectedId: string | null = null;

  constructor(adt: AdvancedDynamicTexture, scene: Scene, segments: readonly SnakeSegment[]) {
    this.segmentsById = new Map(segments.map((segment) => [segment.id, segment]));

    const panel = new StackPanel("inspector-panel");
    panel.width = "220px";
    panel.isVertical = true;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    panel.top = "16px";
    panel.left = "16px";
    panel.spacing = 8;
    adt.addControl(panel);

    const header = new TextBlock("inspector-header", "Выбранный сегмент:");
    header.height = "24px";
    header.color = "white";
    header.fontSize = 16;
    panel.addControl(header);

    this.idText = new TextBlock("inspector-id", NO_SELECTION_LABEL);
    this.idText.height = "28px";
    this.idText.color = "white";
    this.idText.fontSize = 20;
    panel.addControl(this.idText);

    for (const option of COLOR_OPTIONS) {
      const button = Button.CreateSimpleButton(`color-button-${option.label}`, option.label);
      button.height = "40px";
      button.color = "white";
      button.cornerRadius = 6;
      button.background = option.color.toHexString();
      button.onPointerClickObservable.add(() => this.applySelectedColor(option.color));
      panel.addControl(button);
    }

    for (const segment of segments) {
      segment.mesh.actionManager = new ActionManager(scene);
      segment.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => this.selectSegment(segment.id)),
      );
    }
  }

  private selectSegment(id: string): void {
    this.selectedId = id;
    this.idText.text = id;
  }

  private applySelectedColor(color: Color3): void {
    if (this.selectedId === null) return;
    const segment = this.segmentsById.get(this.selectedId);
    if (segment === undefined) return;
    segment.material.setColor3("baseColor", color);
  }
}
