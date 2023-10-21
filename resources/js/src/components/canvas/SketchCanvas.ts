import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {consume} from "@lit/context";
import {brushContext, featuresContext, sketchBookContext} from "../../store/AppContext.js";
import {Brush} from "../../domain/model/Brush.js";
import {DrawingTool} from "../../domain/model/DrawingTool.js";
import {ToggleRouter} from "../../services/ToggleRouter.js";
import {SketchBook} from "../../domain/model/SketchBook.js";

@customElement('sketch-canvas')
export class SketchCanvas extends LitElement {
  static styles = css`
    :host {
      height: 80vh;
    }

    .sheet {
      display: block;
      position: relative;
      width: 120vh;
      cursor: none;
      background: transparent;
    }

    .white-background {
      background: #FFFFFF;
    }

    .background {
      width: 120vh;
      position: absolute;
      top: 0;
      z-index: -1;
      background: #ffffff;
    }

    .cursor {
      user-select: none;
      cursor: none;
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
      pointer-events: none;
      z-index: 15;
      border: 1px solid #000000;
    }
  `

  @query(".sheet") canvas!: HTMLCanvasElement;

  @query(".background") background!: HTMLCanvasElement;

  @query(".cursor") cursor!: HTMLDivElement;

  @consume({context: brushContext, subscribe: true})
  @property({attribute: false})
  brush: Brush

  @consume({context: sketchBookContext, subscribe: true})
  @property({attribute: false})
  sketchBook: SketchBook

  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  features: ToggleRouter

  @property() canvasBackgroundColor: boolean = false;

  @property() resetCanvas: boolean = false;

  @property() sketchId: string = '';

  @property() canvasWidth: number = 960;

  @property() canvasHeight: number = 0;

  @property() image: URL;

  @property() drawingTool: DrawingTool;

  protected firstUpdated() {
    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
    this.drawingTool = new DrawingTool(this.canvas.getContext("2d"))
    this.drawingTool.clearCanvas(this.canvasWidth, this.canvasHeight, this.image);
    this.drawingTool.setBrush(this.brush);
    this.canvasBackgroundColor = this.features!.isEnabled('canvas-background-color')
    if (this.canvasBackgroundColor) {
      this.canvas.classList.remove('white-background')
    }

    setTimeout(() => this.drawingTool.setImage(this.image), 500);
  }

  protected async updated(_changedProperties) {
    super.updated(_changedProperties);
    this.drawingTool.setBrush(this.brush);
    const image = _changedProperties.get('image');
    if (typeof image === 'string') {
      this.image = new URL(this.image);
    }
    if (this.resetCanvas === true) {
      this.canvasWidth = this.offsetWidth;
      this.canvasHeight = this.parentElement!.offsetHeight - 50;
      this.drawingTool.clearCanvas(this.canvasWidth, this.canvasHeight, this.image);
      this.drawingTool.setImage(this.image);
      this.resetCanvas = false;
      this.dispatchEvent(new CustomEvent('canvasreseted', {
        detail: this.sketchId
      }))
    }
  }

  protected moveCursor(event: MouseEvent) {
    const cursorWidth =  this.brush.lineWidth > 3 ? this.brush.lineWidth : 3;
    this.cursor.style.width = `${cursorWidth}px`;
    this.cursor.style.height = `${cursorWidth}px`;
    this.cursor.style.background = this.brush.color;
    const mouseY = event.offsetY - (this.brush.lineWidth / 2);
    const mouseX = event.offsetX - (this.brush.lineWidth / 2);
    this.cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }

  protected draw(event: MouseEvent) {
    this.drawingTool.draw(event.offsetX, event.offsetY);
    this.moveCursor(event);
  }

  protected startDrawing(event: MouseEvent) {
    if (!this.drawingTool.hasCurrentBrush(this.brush)) {
      this.drawingTool.setBrush(this.brush);
    }

    this.drawingTool.startDrawing(event.offsetX, event.offsetY);
  }

  protected stopDrawing() {
    if (this.drawingTool.stopDrawing()) {
      this.saveSketchBook();
    }
  }

  protected saveSketchBook() {
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: {
          id: this.sketchId,
          image: new URL(this.canvas.toDataURL("image/png")),
          background: this.sketchBook.background,
        }
      }
    ))
  }

  private renderBackgroundVariant() {
    if (this.canvasBackgroundColor) {
      return html`
        <canvas
          .style="background:${this.sketchBook.background};"
          class="background"
          width=${this.canvasWidth}
          height=${this.canvasHeight}
        >
        </canvas>
      `
    }

    return html``;
  }

  protected render() {
    const draggable = false;
    return html`
      <div
        @ondragstart=${draggable}
        @ondrop=${draggable}
        class="cursor"
      ></div>
      <canvas
        class="sheet white-background"
        width=${this.canvasWidth}
        height=${this.canvasHeight}
        @mousedown=${this.startDrawing}
        @mousemove=${this.draw}
        @mouseover=${this.moveCursor}
        @mouseup=${this.stopDrawing}
        @mouseout=${this.stopDrawing}
      >
      </canvas>
      ${this.renderBackgroundVariant()}
    `;
  }
}
