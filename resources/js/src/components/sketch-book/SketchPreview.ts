import {LitElement, css, html} from "lit";
import {customElement, property} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import {consume} from "@lit/context";
import {featuresContext} from "../../store/AppContext.js";
import {ToggleRouter} from "../../services/ToggleRouter.js";

@customElement('sketch-preview')
export class SketchPreview extends LitElement {
  static styles = css`
    :host {
      --md-icon-button-icon-color: #ffffff;
      --md-sys-color-primary: #4a5568;
    }

    .preview {
      display: block;
    }

    .image {
      cursor: pointer;
      margin-top: -20px;
      margin-left: 20px;
      margin-right: 20px;
      display: flex;
      height: 85px;
      width: 150px;
      background: #FFFFFF;
    }

    .buttons {
      position: relative;
      display: inline-flex;
    }

    .buttons .close-button {
      position: absolute;
      top: -25px;
      left: 140px;
    }

    .buttons .download-button {
      position: absolute;
      top: -25px;
      left: 95px;
    }

    md-filled-icon-button {
      --md-sys-color-primary: #4F82A0FF
    }
  `

  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  features: ToggleRouter

  @property() sketchId: number = 1;

  @property() image: URL = new URL("data:,");

  @property() background: string;

  protected selectSketch() {
    this.dispatchEvent(new CustomEvent(
      'sketchselected',
    {
      detail: this.sketchId
    }
    ));
  }

  protected deleteSketch() {
    this.dispatchEvent(new CustomEvent(
      'sketchdeleted',
    {
      detail: this.sketchId
    }
    ));
  }

  protected downloadSketch() {
    this.dispatchEvent(new CustomEvent(
      'sketchdownloaded',
    {
      detail: this.sketchId
    }
    ));
  }

  private renderCloseButton()
  {
    return html`
      <md-filled-icon-button
        class="close-button"
        @click=${this.deleteSketch}
      >
        <md-icon>close</md-icon>
      </md-filled-icon-button>
    `;
  }

  private renderDownloadButton()
  {
    const exportAsPng = this.features.isEnabled('export-sketch-as-png')

    if (!exportAsPng) {
      return html``;
    }

    return html`
      <md-filled-icon-button
        class="download-button"
        @click=${this.downloadSketch}
      >
        <md-icon>save</md-icon>
      </md-filled-icon-button>
    `;
  }

  protected render() {
    const canvasBackgroundColor = this.features.isEnabled('canvas-background-color')

    if (this.image.toString() === "data:,") {
      return html`
        <div class="preview">
          <div class="buttons">
            ${this.renderDownloadButton()}
            ${this.renderCloseButton()}
          </div>
          <div
            style="background:${canvasBackgroundColor ? this.background : '#ffffff'}"
            class="image"
            @click=${this.selectSketch}
            @keyup="" ${this.selectSketch}
          ></div>
        </div>
      `;
    }

    return html`
      <div class="preview">
        <div class="buttons">
          ${this.renderDownloadButton()}
          ${this.renderCloseButton()}
        </div>
        <img
          style="background:${canvasBackgroundColor ? this.background : '#ffffff'}"
          alt="canvas"
          class="image"
          src=${this.image.toString()}
          @click=${this.selectSketch}
          @keyup="" ${this.selectSketch}
          height="85"
        />
      </div>
    `;
  }
}
