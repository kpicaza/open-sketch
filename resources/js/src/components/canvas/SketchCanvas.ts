import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('sketch-canvas')
export class SketchCanvas extends LitElement {
  static styles = css`
    :host {
      height: 80vh;
    }

    canvas {
      width: 120vh;
      background: #FFFFFF;
      cursor: crosshair;
    }
  `

  @query("#sheet") canvas!: HTMLCanvasElement;

  @property() context: CanvasRenderingContext2D | null = null;
  @property() painting: boolean = false;
  @property() lineWidth: number = 3;
  @property() canvasWidth: number = 960;
  @property() canvasHeight: number = 0;
  @property() color: string = "#000000";
  @property() image?: URL;
  @property() brush: string = 'pen';
  @property() clear: boolean = false;

  protected firstUpdated() {
    this.context = this.canvas.getContext("2d")
    this.clearCanvas();
    this.context!.lineJoin = "round";
    this.context!.lineCap = "round";
    this.setBrush();
    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
    this.setImage();
    setTimeout(() => this.setImage(), 500);
  }

  protected async updated(_changedProperties) {
    super.updated(_changedProperties);
    const image = _changedProperties.get('image');
    if (typeof image == 'string') {
      this.image = new URL(this.image);
    }
    if (typeof image == 'object') {
      this.clearCanvas();
      this.setImage();
      await this.updateComplete
    }
  }

  private clearCanvas() {
    this.context?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.setImage();
  }

  protected setImage() {
    const img = new Image();
    img.onload = () => {
          this.context!.drawImage(img, 0, 0);
    };
    setTimeout(() => img.src = this.image.toString(), 0);
  }

  protected setBrush() {
    if(this.brush === "pencil"){
      this.context!.lineWidth = this.lineWidth / 4;
      this.context!.shadowBlur = this.lineWidth / 2;
      this.context!.shadowColor = this.color;
    } else {
      this.context!.lineWidth = this.lineWidth;
      this.context!.shadowBlur = 0;

    }

    this.context!.fillStyle = this.color;
    this.context!.strokeStyle = this.color;

    if(this.brush === "eraser"){
      this.context!.lineWidth = this.lineWidth;
      this.context!.shadowBlur = this.lineWidth;
      this.context!.globalCompositeOperation="destination-out";
    }else{
      this.context!.globalCompositeOperation="source-over";
    }
  }

  protected draw(event: MouseEvent) {
    if (this.painting) {
      this.context!.lineTo(event.offsetX, event.offsetY);
      this.context!.stroke();
    }
  }

  protected dash(event: MouseEvent) {
    this.context!.beginPath();
    this.context!.arc(
      event.offsetX,
      event.offsetY,
      this.lineWidth / Math.PI,
      0,
      0
    );
    this.context!.stroke();
  }

  protected startDrawing(event: MouseEvent) {
    this.setBrush()
   // this.dash(event);
    this.context!.beginPath();
    this.context!.moveTo(event.offsetX, event.offsetY);
    this.painting = true;
  }

  protected stopDrawing(event: MouseEvent) {
    if (!this.painting) {
      return;
    }
    this.context!.globalCompositeOperation="source-over";
    this.saveSketchBook();
    this.painting = false;
  }

  protected saveSketchBook() {
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: new URL(this.canvas.toDataURL("image/png"))
      }
    ))

  }

  protected render() {
    return html`
      <canvas
        id="sheet"
        width=${this.canvasWidth}
        height=${this.canvasHeight}
        @mousedown=${this.startDrawing}
        @mousemove=${this.draw}
        @mouseup=${this.stopDrawing}
        @mouseout=${this.stopDrawing}
        @click=${this.dash}
      ></canvas>
    `;
  }
}
