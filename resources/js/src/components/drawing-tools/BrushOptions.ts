import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {consume} from "@lit/context";
import {featuresContext} from "../../store/AppContext.js";
import {ToggleRouter} from "../../services/ToggleRouter.js";
import {Brush} from "../../domain/model/Brush.js";
import {Palette} from "../../domain/model/Palette.js";
import '@material/web/slider/slider.js'
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker.js"
import "./Eraser.js"
import "./Pen.js"
import "./Pencil.js"

@customElement('brush-options')
export class BrushOptions extends LitElement {
  static styles = css`
      :host {

      }

      .brush {
        display: block;
        position: fixed;
        left: 0;
        top: 0;
        background: #218BC3;
        height: 120px;
        width: 100px;
        cursor: pointer;
        animation: moveUp .25s;
      }

      .brush:hover, .brush.selected {
        animation: moveDown .25s;
        top: 15px;
      }

      @keyframes moveDown {
        from {
          top: 0px;
        }
        to {
          top: 15px;
        }
      }
      @keyframes moveUp {
        from {
          top: 15px;
        }
        to {
          top: 0px;
        }
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

      .brush-width-slider {
        position: fixed;
        left: 475px;
        top: 70px;
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

      .rounded, input.rounded[type="color"] {
        cursor: pointer;
        position: absolute;;
        top: 0px;
        left: 0;
        -webkit-appearance: none;
        border: none;
        width: 50px;
        height: 50px;
        background: transparent;
        --sl-input-border-color: transparent;
        --sl-color-neutral-0: transparent;
      }

      .rounded.background-color {
        top: -16px;
        left: -20px;
        --sl-input-height-large: 90px;
        height: 90px;
        --sl-input-border-color: #000000;
        --sl-color-neutral-0: currentcolor;
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

      input.rounded.secondary-1[type="color"],
      input.rounded.secondary-2[type="color"],
      input.rounded.secondary-3[type="color"] {
        position: relative;
        display: inline-flex;
        top: -15px;
        left: 50px;
        cursor: pointer;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: transparent;
      }

    \` ;

        position: relative;
        display: inline-flex;
        top: -15px;
        left: 50px;
        cursor: pointer;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: transparent;
      }
    `;

  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  declare features: ToggleRouter

  @query('.background-color-input-button') backgroundInputButton: HTMLDivElement;

  @query('.background-color') backgroundInput: HTMLInputElement;

  @property() declare color: string;

  @property() declare backgroundColor: string;

  @property() declare selectedBrush: string;

  @property() declare lineWidth: number;

  @property() declare lineWidthInput: number;

  @property() declare previousColor1: string;

  @property() declare previousColor2: string;

  @property() declare previousColor3: string;

  constructor() {
    super();
    this.selectedBrush = 'pen';
    this.lineWidth = 3;
    this.lineWidthInput = 9;
    this.color = "#000000";
    this.backgroundColor = "#ffffff";
    this.previousColor1 = '#527474';
    this.previousColor2 = '#844ab2';
    this.previousColor3 = '#e89cb9';
  }

  protected firstUpdated() {
    this.lineWidthInput = this.lineWidth * Math.PI;
  }

  protected changeLineWidth(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.lineWidthInput = input.value as unknown as number;
    this.lineWidth = this.lineWidthInput / Math.PI;
    this.dispatchEvent(new CustomEvent(
      'linewidthchanged',
      {
        detail: {
          type: this.selectedBrush,
          width: this.lineWidth,
        } as Brush,
      }
    ));
  }

  protected changeColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.previousColor3 = this.previousColor2;
    this.previousColor2 = this.previousColor1;
    this.previousColor1 = this.color;
    this.color = input.value;
    this.dispatchEvent(new CustomEvent(
      'colorchanged',
      {
        detail: {
          primaryColor: this.color,
          backgroundColor: this.backgroundColor,
          secondaryColor1: this.previousColor1,
          secondaryColor2: this.previousColor2,
          secondaryColor3: this.previousColor3,
        } as Palette,
      }
    ));
  }

  private changeToPreviousColor(event: InputEvent) {
    event.preventDefault();
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    const newColor = input.value;
    input.value = this.color;
    this.color = newColor;
    this.dispatchEvent(new CustomEvent(
      'colorchanged',
      {
        detail: {
          primaryColor: this.color,
          backgroundColor: this.backgroundColor,
          secondaryColor1: this.previousColor1,
          secondaryColor2: this.previousColor2,
          secondaryColor3: this.previousColor3,
        } as Palette,
      }
    ));
  }

  protected changeBackgroundColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.backgroundColor = input.value;
    this.dispatchEvent(new CustomEvent(
      'backgroundcolorchanged',
      {
        detail: {
          primaryColor: this.color,
          backgroundColor: input.value,
          secondaryColor1: this.previousColor1,
          secondaryColor2: this.previousColor2,
          secondaryColor3: this.previousColor3,
        } as Palette,
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
        detail: {
          type: this.selectedBrush,
          width: this.lineWidth,
        } as Brush,
      }
    ));

    await this.updateComplete;
  }

  private renderSecondaryColorPickers() {
    return html `
        <input
          class="rounded secondary-1"
          @click=${this.changeToPreviousColor}
          type="color"
          .value=${this.previousColor1}
        />
        <input
          class="rounded secondary-2"
          @click=${this.changeToPreviousColor}
          type="color"
          .value=${this.previousColor2}
        />
        <input
          class="rounded secondary-3"
          @click=${this.changeToPreviousColor}
          type="color"
          .value=${this.previousColor3}
        />
    `;
  }

  private renderColorPicker() {
    const canvasBackgroundColor = this.features.isEnabled('canvas-background-color')

    if (canvasBackgroundColor) {
      return html `
        <sl-color-picker
          class="background-color rounded"
          .value=${this.backgroundColor}
          size="large"
          label="Select a color"
          @sl-blur=${this.changeBackgroundColor}
        ></sl-color-picker>
        <sl-color-picker
          class="rounded"
          .value=${this.color}
          size="large"
          label="Select a color"
          @sl-blur=${this.changeColor}
        ></sl-color-picker>

        ${this.renderSecondaryColorPickers()}
      `
    }

    return html `
      <input class="color"  type="color" @input=${this.changeColor} .value=${this.color} />
      ${this.renderSecondaryColorPickers()}
    `
  }

  protected render() {
    return html`
      <div
        class="brushes">
        ${this.renderColorPicker()}
        <md-slider
          class="brush-width-slider"
          ticks
          min="2"
          max="100"
          @change=${this.changeLineWidth}
          .value=${this.lineWidthInput}
        ></md-slider>
        <brush-pen
          class="brush pen ${this.selectedBrush === 'pen' ? 'selected' : ''}"
          data-value="pen"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pen>
        <brush-pencil
          class="brush pencil ${this.selectedBrush === 'pencil' ? 'selected' : ''}"
          data-value="pencil"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pencil>
        <brush-eraser
          class="brush eraser ${this.selectedBrush === 'eraser' ? 'selected' : ''}"
          data-value="eraser"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-eraser>
      </div>
    `;
  }
}
