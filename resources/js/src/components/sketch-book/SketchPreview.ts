import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import {consume} from "@lit/context";
import {featuresContext} from "../../store/AppContext";
import {Feature} from "../../types/Feature";
import {ToggleRouter} from "../../services/ToggleRouter";

@customElement('sketch-preview')
export class SketchPreview extends LitElement {
  static styles = css`
    :host {
      --md-icon-button-icon-color: #ffffff;
      --md-sys-color-primary: #4a5568;
    }

    .image {
      cursor: pointer;
      margin-top: 20px;
      margin-left: 20px;
      margin-right: 20px;
      display: inline-block;
      height: 85px;
      width: 150px;
      background: #FFFFFF;
    }

    .close-button {
      position: absolute;
      top: 0;
      margin-left: -40px;
    }

    .download-button {
      position: absolute;
      top: 0;
      margin-left: -80px;
    }

    md-filled-icon-button {
      --md-sys-color-primary: #4F82A0FF
    }
  `

  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  features?: Array<Feature>

  @property() sketchId: number = 1;
  @property() image: URL = new URL("data:,");

  protected async firstUpdated() {
  }

  protected selectSketch(event: MouseEvent) {
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
    const toggleRouter = new ToggleRouter(this.features);
    const exportAsPng = toggleRouter.isEnabled('export-sketch-as-png')

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
    if ("data:," === this.image.toString()) {
      return html`
        <div
          class="image"
          @click=${this.selectSketch}
        ></div>
        ${this.renderCloseButton()}
        ${this.renderDownloadButton()}
      `;
    }

    return html`
      <img
        class="image"
        src=${this.image.toString()}
        @click=${this.selectSketch}
        height="85"
      />
      ${this.renderCloseButton()}
      ${this.renderDownloadButton()}
    `;
  }
}
