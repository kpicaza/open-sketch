import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {consume} from "@lit/context";
import {featuresContext, sketchBookContext} from "../../store/AppContext.js";
import {ToggleRouter} from "../../services/ToggleRouter.js";
import '@material/web/icon/icon.js'
import {SketchBook} from "../../domain/model/SketchBook.js";
import "./Eraser.js"
import "./Pen.js"
import "./Pencil.js"

@customElement('brush-options')
export class BrushOptions extends LitElement {
  static styles = css`
    .brush {
      display: block;
      position: fixed;
      left: 0;
      top: 0;
      background: #218BC3;
      height: 120px;
      width: 100px;
      cursor: pointer;
      animation:moveUp .25s;
    }
    .brush:hover, .brush.selected {
      animation:moveDown .25s;
      top: 15px;
    }
    @keyframes moveDown{
      from {top: 0px;}
      to{top:15px;}
    }
    @keyframes moveUp{
      from {top: 15px;}
      to{top:0px;}
    }
    .pen {
      margin-top: -150px;
      overflow: visible;
    }
    .pencil {
      margin-top: -150px;
      left: 70px;
    }
    .eraser {
      left: 240px;
      margin-top: -170px;
    }
    input.color[type="color"] {
      cursor: pointer;
      position: absolute;;
      top: -10px;
      left: 0;
      -webkit-appearance: none;
      border: none;
      width: 60px;
      height: 60px;
    }
    input.color[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    input.color[type="color"]::-webkit-color-swatch {
      border: none;
    }
    input.rounded[type="color"] {
      cursor: pointer;
      position: absolute;;
      top: 0px;
      left: 0;
      -webkit-appearance: none;
      border: none;
      width: 50px;
      height: 50px;
      background: transparent;
    }
    input.rounded.background-color[type="color"] {
      top: -20px;
      left: -20px;
      width: 90px;
      height: 90px;
    }
    input.rounded[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input.rounded[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }
    input.rounded.background-color[type="color"]::-webkit-color-swatch {
      border: 1px black solid;
      border-radius: 50%;
    }
    input[type="range"] {
      cursor: pointer;
      position: absolute;
      top: 15px;
      left: 50px;
      transform: rotate(270deg);
      width: 60px;
    }
  `;

  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  declare features: ToggleRouter

  @consume({context: sketchBookContext, subscribe: true})
  @property({attribute: false})
  declare sketchBook: SketchBook

  @query('.background-color-input-button') backgroundInputButton: HTMLDivElement;

  @query('.background-color-input') backgroundInput: HTMLInputElement;

  @property() declare color: string;

  @property() declare selectedBrush: string;

  @property() declare lineWidth: number;

  constructor() {
    super();
    this.color = "#000000";
    this.selectedBrush = 'pen';
    this.lineWidth = 3;
  }

  protected changeLineWidth(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.lineWidth = input.value as unknown as number / Math.PI
    this.dispatchEvent(new CustomEvent(
      'linewidthchanged',
      {
        detail: this.lineWidth,
      }
    ));
  }

  protected changeColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.color = input.value;
    this.dispatchEvent(new CustomEvent(
      'colorchanged',
      {
        detail: this.color,
      }
    ));
  }

  protected changeBackgroundColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent(
      'backgroundcolorchanged',
      {
        detail: input.value,
      }
    ));
  }

  private async selectBrush(event: MouseEvent)
  {
    const selectedBrush: HTMLInputElement = event.target as HTMLInputElement;
    const brushes: NodeList = selectedBrush.parentElement.querySelectorAll('.brush') as NodeList

    brushes.forEach((brush: HTMLDivElement) => {
      brush.classList.remove('selected');
    })

    selectedBrush.classList.add('selected')
    this.selectedBrush = selectedBrush.dataset.value as string;

    this.dispatchEvent(new CustomEvent(
      'brushselected',
      {
        detail: this.selectedBrush,
      }
    ));

    await this.updateComplete;
  }

  private renderColorPicker() {
    const canvasBackgroundColor = this.features.isEnabled('canvas-background-color')

    if (canvasBackgroundColor) {
      return html `
        <input
          class="background-color rounded"
          type="color"
          @change=${this.changeBackgroundColor}
          .value=${this.sketchBook.background}
        />
        <input class="rounded" type="color" @change=${this.changeColor} .value=${this.color} />
      `
    }

    return html `
      <input class="color"  type="color" @input=${this.changeColor} .value=${this.color} />
    `
  }

  protected render() {
    return html`
      <div class="brushes">
        ${this.renderColorPicker()}
        <input type="range" min="2" max="100" @input=${this.changeLineWidth} .value=${this.lineWidth} />
        <brush-pen
          class="brush pen selected"
          data-value="pen"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pen>
        <brush-pencil
          class="brush pencil"
          data-value="pencil"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pencil>
        <brush-eraser
          class="brush eraser"
          data-value="eraser"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-eraser>
      </div>
    `;
  }
}
