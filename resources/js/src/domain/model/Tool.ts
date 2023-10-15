export interface Tool {
  name(): string;
  startDrawing(offsetX: number, offsetY: number);
  draw(offsetX: number, offsetY: number);
  stopDrawing();
}
