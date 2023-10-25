import {LitElement, html, css, PropertyValues} from 'lit';
import {query, property, state} from 'lit/decorators.js';
import {provide} from "@lit/context";
import { use } from "lit-translate";
import {MdIconButton} from "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import {loadSketchBook, saveSketchBook, downloadSketch} from "../store/SketchBookState.js";
import {featuresAvailable} from "../store/FeatureFlags.js";
import {featuresContext, sketchBookContext} from "../store/AppContext.js";
import {ToggleRouter} from "../services/ToggleRouter.js";
import {defaultSketchBook, SketchBook} from "../domain/model/SketchBook.js";
import {Sketch} from "../domain/model/Sketch.js";
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
      z-index: 2;
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

    sketch-nav {
      width: 100%;
      display: block;
    }
  `;

  @provide({context: sketchBookContext})
  sketchBook: SketchBook = defaultSketchBook();

  @provide({context: featuresContext})
  features!: ToggleRouter = new ToggleRouter([]);

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
      brush: this.sketchBook.brush,
      palette: this.sketchBook.palette,
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
      brush: this.sketchBook.brush,
      palette: this.sketchBook.palette,
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
      brush: this.sketchBook.brush,
      palette: this.sketchBook.palette,
    };

    this.resetCanvas = true;
    await saveSketchBook(this.sketchBook);
  }

  private downloadSketch(event: CustomEvent) {
    downloadSketch(this.sketchBookId, event.detail)
  }

  private async changeBrush(event: CustomEvent) {
    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: this.sketchBook.sketches,
      brush: event.detail,
      palette: this.sketchBook.palette,
    };
    await saveSketchBook(this.sketchBook);
  }

  protected async changePalette(event: CustomEvent) {
    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: this.sketchBook.sketches,
      brush: this.sketchBook.brush,
      palette: event.detail,
    };
    await saveSketchBook(this.sketchBook);
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
          @linewidthchanged=${this.changeBrush}
          @brushselected=${this.changeBrush}
          @colorchanged=${this.changePalette}
          @backgroundcolorchanged=${this.changePalette}
          .brushType=${this.sketchBook.brush.type}
          .lineWidth=${this.sketchBook.brush.width}
          .color=${this.sketchBook.palette.primaryColor}
          .backgroundColor=${this.sketchBook.palette.backgroundColor}
          .previousColor1=${this.sketchBook.palette.secondaryColor1}
          .previousColor2=${this.sketchBook.palette.secondaryColor2}
          .previousColor3=${this.sketchBook.palette.secondaryColor3}
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
