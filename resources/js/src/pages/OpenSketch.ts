import {LitElement, html, css, PropertyValues} from 'lit';
import {query, property, customElement, state} from 'lit/decorators.js';
import {provide} from "@lit/context";
import {loadSketchBook, saveSketchBook, downloadSketch} from "../store/SketchBookState";
import {featuresAvailable} from "../store/FeatureFlags";
import {brushContext, featuresContext, sketchBookContext} from "../store/AppContext";
import {SketchBook} from "../domain/model/SketchBook";
import {Sketch} from "../domain/model/Sketch";
import {Brush} from "../domain/model/Brush";
import "./../components/canvas/SketchCanvas";
import "./../components/settings/SettingsMenu";
import "./../components/sketch-book/AddSketch";
import "./../components/sketch-book/SketchPreview";
import "./../components/sketch-book/SketchNavigator";
import "./../components/sketch-book/PaintingBoard";
import "./../components/drawing-tools/BrushOptions";
import "@material/web/iconbutton/filled-icon-button.js";
import {Feature} from "../types/Feature";
import { use } from "lit-translate";
import  '../lang/LangConfig'
import {MdIconButton} from "@material/web/all";

@customElement('open-sketch')
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
    lineWidth: 5,
    color: '#000000',
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
    background: '#ffffff'
  }
  @provide({context: featuresContext}) features!: Array<Feature> = [];


  @query("painting-board") sketchWrapper: HTMLDivElement;
  @query("footer") sketchFooter: HTMLDivElement;
  @query(".restart-button") restartButton: MdIconButton;
  @property() lang: string = 'en';
  @property() sketchBookId: string = '';
  @property() canvasColor: string = '#ffffff';
  @property() previewScrollPosition: number = 0;
  @property() resetCanvas: boolean = false;
  @property() exportAsPng: boolean = false;

  @state() hasLoadedStrings = false;

  protected shouldUpdate(props: PropertyValues) {
    return this.hasLoadedStrings && super.shouldUpdate(props);
  }

  async connectedCallback() {
    super.connectedCallback();

    await use(this.lang);
    this.hasLoadedStrings = true;
  }

  protected async firstUpdated() {
    this.sketchBook = await loadSketchBook(this.sketchBookId);
    this.features = await featuresAvailable();
  }

  protected async appendSketch(event: CustomEvent) {
    const sketches = this.sketchBook.sketches;
    sketches.push({
      id: this.sketchBook.sketches.length + 1,
      image: new URL("data:,")
    })

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: sketches,
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
    const sketches = this.sketchBook.sketches;
    sketches[event.detail.id as number - 1].image = event.detail.image;

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: sketches,
      background: event.detail.background
    };

    await saveSketchBook(this.sketchBook);
  }

  protected async deleteSketch(event: CustomEvent) {
    const sketches = this.sketchBook.sketches;
    const newSketches = sketches.filter(
      (sketch) => sketch.id != event.detail
    ).map((sketch, key) => {
      return {
        id: key + 1,
        image: sketch.image,
      } as Sketch
    }).filter(() => true);

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
    this.brush.color= event.detail;
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

  private canvasReset(event: CustomEvent) {
    this.resetCanvas = false;
  }

  protected async goToSelectedSketch(event: CustomEvent) {
    const body = this.parentElement.parentElement;
    const sketch = this.sketchWrapper.shadowRoot.querySelector(".sketch-" + event.detail)
    const position = sketch.getBoundingClientRect();
    await body.scroll({
      top: 0,
      left: (event.detail * (position.width + 130)) - position.width,
      behavior: "smooth",
    })
  }

  private showRestartButton(event: Event) {
    this.restartButton.style.display = 'inline-flex';
  }

  private async restart()
  {
    await fetch(
      '/api/restart/' + this.sketchBookId,
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
