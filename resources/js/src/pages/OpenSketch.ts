import {LitElement, html, css, PropertyValues} from 'lit';
import {query, property, state} from 'lit/decorators.js';
import {provide} from "@lit/context";
import { use } from "lit-translate";
import {MdIconButton} from "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import {loadSketchBook, saveSketchBook, downloadSketch} from "../store/SketchBookState.js";
import {featuresAvailable} from "../store/FeatureFlags.js";
import {brushContext, featuresContext, sketchBookContext} from "../store/AppContext.js";
import {ToggleRouter} from "../services/ToggleRouter.js";
import {SketchBook} from "../domain/model/SketchBook.js";
import {Sketch} from "../domain/model/Sketch.js";
import {Brush} from "../domain/model/Brush.js";
import "../components/canvas/SketchCanvas.js";
import "../components/settings/SettingsMenu.js";
import "../components/sketch-book/AddSketch.js";
import "../components/sketch-book/SketchPreview.js";
import "../components/sketch-book/SketchNavigator.js";
import "../components/sketch-book/PaintingBoard.js";
import "../components/drawing-tools/BrushOptions.js";
import "../lang/LangConfig.js"

export class OpenSketch extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      width: 100%;
      margin: 0 auto;
      background-color: var(--open-sketch-background-color);
      --md-ref-typeface-brand: 'Open Sans';
      --md-ref-typeface-plain: system-ui;
    }

    .brush-tools {
      display: Block;
      position: fixed;
      top: 0;
      left: 400px;
      height: 100px;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    main {
      margin-top: 130px;
      position: absolute;
      top: 0;
      left: 0;
      flex-grow: 1;
    }

    .sketch-book-controls {
      position: fixed;
      top: 0;
      right: 0;
      width: 125px;
      z-index: 10;
      background: #2e3748;
    }

    .sketch-book-controls settings-menu{
      position: absolute;
      left: 40px;
      top: 20px;
    }

    .sketch-book-controls .restart-button {
      display: none;
      --md-filled-icon-button-container-width: 45px;
      --md-filled-icon-button-container-height: 45px;
      --md-sys-color-primary: #dc362e;
      position: absolute;
      left: 40px;
      top: 90px;
    }

    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 125px;
      background: #1a202c;
      z-index: 20;
    }
  `;

  @provide({context: brushContext}) brush: Brush = {
    lineWidth: 3,
    color: '#484545',
    type: 'pen'
  }

  @provide({context: sketchBookContext}) sketchBook: SketchBook = {
    id: "",
    sketches: [
      {
        id: 1,
        image: new URL("data:,"),
      }
    ],
    background: '#e8f6f1'
  }

  @provide({context: featuresContext}) features!: ToggleRouter = new ToggleRouter([]);

  @query("painting-board") sketchWrapper: HTMLDivElement;

  @query("footer") sketchFooter: HTMLDivElement;

  @query(".restart-button") restartButton: MdIconButton;

  @property() declare language: string;

  @property() declare sketchBookId: string;

  @property() declare canvasColor: string;

  @property() declare previewScrollPosition: number;

  @property() declare resetCanvas: boolean;

  @property() declare exportAsPng: boolean;

  @state() declare hasLoadedStrings: boolean;

  protected shouldUpdate(props: PropertyValues) {
    return this.hasLoadedStrings && super.shouldUpdate(props);
  }

  constructor() {
    super();
    this.language = 'en';
    this.sketchBookId = '';
    this.canvasColor = '#ffffff';
    this.previewScrollPosition = 0;
    this.resetCanvas = false;
    this.exportAsPng = false;
    this.hasLoadedStrings = false;
    window.addEventListener('resize', async () => {
      this.resetCanvas = true
      await this.updateComplete;
    });
  }

  async connectedCallback() {
    this.features = new ToggleRouter(await featuresAvailable());
    this.sketchBook = await loadSketchBook(this.sketchBookId);
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    await use(this.language);
    this.hasLoadedStrings = true;
  }

  protected async appendSketch() {
    const {sketches} = this.sketchBook;
    sketches.push({
      id: this.sketchBook.sketches.length + 1,
      image: new URL("data:,")
    })

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches,
      background: this.sketchBook.background
    };

    const body = this.parentElement.parentElement;
    const scrollWidth = body.scrollWidth + 100;
    setTimeout(() => {
      body.scroll({
        top: 0,
        left: scrollWidth,
        behavior: "smooth",
      })
    })
  }

  protected async saveSketchBook(event: CustomEvent) {
    const {sketches} = this.sketchBook;
    sketches[event.detail.id as number - 1].image = event.detail.image;

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches,
      background: event.detail.background
    };

    await saveSketchBook(this.sketchBook);
  }

  protected async deleteSketch(event: CustomEvent) {
    const {sketches} = this.sketchBook;
    const newSketches = sketches.filter(
      (sketch) => sketch.id !== event.detail
    ).map((sketch, key) => ({
        id: key + 1,
        image: sketch.image,
      } as Sketch)).filter(() => true);

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: newSketches,
      background: this.sketchBook.background
    };

    this.resetCanvas = true;
    await saveSketchBook(this.sketchBook);
  }

  private downloadSketch(event: CustomEvent) {
    downloadSketch(this.sketchBookId, event.detail)
  }

  protected changeBrushLineWidth(event: CustomEvent) {
    this.brush.lineWidth = event.detail
  }

  protected changeBrushColor(event: CustomEvent) {
    this.brush.color = event.detail;
  }

  protected async changeBackgroundColor(event: CustomEvent) {
    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: this.sketchBook.sketches,
      background: event.detail
    };

    await saveSketchBook(this.sketchBook);
  }

  private changeBrush(event: CustomEvent) {
    this.brush.type = event.detail;
  }

  private canvasReset() {
    this.resetCanvas = false;
  }

  protected async goToSelectedSketch(event: CustomEvent) {
    const body = this.parentElement.parentElement;
    const sketch = this.sketchWrapper.shadowRoot.querySelector(`.sketch-${  event.detail}`)
    const position = sketch.getBoundingClientRect();
    await body.scroll({
      top: 0,
      left: (event.detail * (position.width + 130)) - position.width,
      behavior: "smooth",
    })
  }

  private showRestartButton() {
    this.restartButton.style.display = 'inline-flex';
  }

  private async restart()
  {
    await fetch(
      `/api/restart/${  this.sketchBookId}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    );

  }

  protected render() {
    return html`
      <menu class="brush-tools">
        <brush-options
          @linewidthchanged=${this.changeBrushLineWidth}
          @colorchanged=${this.changeBrushColor}
          @backgroundcolorchanged=${this.changeBackgroundColor}
          @brushselected=${this.changeBrush}
          .brushType=${this.brush.type}
          .backgroundColor=${this.sketchBook.background}
        ></brush-options>
      </menu>
      <aside class="sketch-book-controls">
        <settings-menu
          @restartrequired=${this.showRestartButton}
        ></settings-menu>
        <md-filled-icon-button
          class="restart-button"
          @click=${this.restart}
        >
          <md-icon>restart_alt</md-icon>
        </md-filled-icon-button>
        <add-sketch
          @sketchadded=${this.appendSketch}
        ></add-sketch>
      </aside>
      <main>
        <painting-board
          @sketchbooksaved=${this.saveSketchBook}
          @canvasreseted=${this.canvasReset}
          .resetCanvas=${this.resetCanvas}
        >
        </painting-board>
      </main>
      <footer>
        <sketch-nav
          @sketchselected=${this.goToSelectedSketch}
          @sketchdeleted=${this.deleteSketch}
          @sketchdownloaded=${this.downloadSketch}
        >
        </sketch-nav>
      </footer>
    `;
  }
}
