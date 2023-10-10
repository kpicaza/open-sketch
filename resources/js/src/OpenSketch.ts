import {LitElement, html, css} from 'lit';
import {query, property, customElement} from 'lit/decorators.js';
import {StoreSubscriber} from "lit-svelte-stores";
import {saveSketchBook, SketchBookState} from "./store/SketchBookState";
import {SketchBookStore} from "./store/AppState";
import {SketchBook} from "./domain/model/SketchBook";
import {Sketch} from "./domain/model/Sketch";
import {Brush} from "./domain/model/Brush";
import "./components/canvas/SketchCanvas";
import "./components/sketch-book/AddSketch";
import "./components/sketch-book/SketchPreview";
import "./components/drawing-tools/BrushOptions";


@customElement('open-sketch')
export class OpenSketch extends LitElement {
  @property({type: String}) header = 'My app';

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      width: 100%;
      margin: 0 auto;
      background-color: var(--open-sketch-background-color);
    }

    .brush-tools {
      display: flex;
      position: fixed;
      top: 0;
      height: 100px;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    main {
      margin-top: 100px;
      flex-grow: 1;
    }

    .horizontal-scroll-wrapper {
      display: flex;
      overflow-x: hidden;
      overflow-y: hidden;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .horizontal-scroll-wrapper > .sketches {
      display: flex;
      flex: 0 0 auto;
    }

    .horizontal-scroll-wrapper > .sketches > .sketch {
      flex-direction: column;
      flex-wrap: wrap;
      height: 80vh;
      margin-left: 65px;
      margin-right: 65px;
    }

    .sketch-book-controls {
      position: fixed;
      right: 0;
      z-index: 10;
    }

    .app-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 125px;
      background: #1a202c;
      z-index: 20;
    }

    .arrow-button {
      cursor: pointer;
      color: #FFFFFF;
      background-color: #9ca3af;
      width: 60px;
      height: 40px;
      border-radius: 8px;
      border: 1px;
      border-color: #9ca3af;
      font-size: 20px;
      font-weight: 700;
      opacity: 0.5;
    }

    .arrow-button:hover {
      background-color: #4a5568;
    }

    .left-previews {
      position: fixed;
      left: 10px;
      bottom: 50px;
    }

    .right-previews {
      position: fixed;
      right: 10px;
      bottom: 50px;
    }
  `;

  @query("main") sketchWrapper: HTMLDivElement;
  @query("footer") sketchFooter: HTMLDivElement;
  @property() sketchNumber: number = 1;
  @property() previewScrollPosition: number = 0;
  @property() brush: Brush = {
    lineWidth: 3,
    color: '#000000'
  };
  @property() sketchBookStore: StoreSubscriber<SketchBookState>;
  @property() sketchBook: SketchBook = {
    id: "",
    sketches: [
      {
        id: 1,
        image: new URL("data:,")
      }
    ]
  };


  constructor() {
    super();
    const url = URL.createObjectURL(new Blob());
    this.sketchBook.id = url.substring(url.lastIndexOf('/') + 1);
    this.sketchBookStore = new StoreSubscriber(this, () => SketchBookStore);
  }

  protected async appendSketch(event: CustomEvent) {
    const body = this.parentElement.parentElement;
    this.sketchNumber++;

    const sketches = this.sketchBook.sketches;
    sketches.push({
      id: this.sketchNumber,
      image: new URL("data:,")
    })

    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: sketches
    }

    await this.updateComplete;

    const scrollWidth = body.scrollWidth + 100;
    await body.scroll({
      top: 0,
      left: scrollWidth,
      behavior: "smooth",
    })
  }

  protected async saveSketchBook(event: CustomEvent) {
    const sketch = event.target as HTMLDivElement;
    const sketches = this.sketchBook.sketches;
    sketches[sketch.dataset.id as number - 1] = {
      id: sketch.dataset.id as number,
      image: event.detail
    }
    this.sketchBook = {
      id: this.sketchBook.id,
      sketches: sketches
    };

    await saveSketchBook(this.sketchBookStore.value, this.sketchBook);
  }

  protected changeBrushLineWidth(event: CustomEvent) {
    this.brush = {
      lineWidth: event.detail,
      color: this.brush.color
    }
  }

  protected changeBrushColor(event: CustomEvent) {
    this.brush = {
      lineWidth: this.brush.lineWidth,
      color: event.detail
    }
  }

  protected async goToSelectedSketch(event: CustomEvent) {
    const body = this.parentElement.parentElement;
    const sketch = this.sketchWrapper.querySelector(".sketch-" + event.detail)
    const position = sketch.getBoundingClientRect();
    await body.scroll({
      top: 0,
      left: (event.detail * (position.width + 130)) - position.width,
      behavior: "smooth",
    })
  }

  protected async movePreviewsToLeft(event: MouseEvent) {
    const button = event.target as HTMLButtonElement
    const previewMenu = button.parentElement.querySelector('.horizontal-scroll-wrapper');
    this.previewScrollPosition = previewMenu.scrollLeft - 200;
    await previewMenu.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  protected async movePreviewsToRight(event: MouseEvent) {
    const button = event.target as HTMLButtonElement
    const previewMenu = button.parentElement.querySelector('.horizontal-scroll-wrapper');
    this.previewScrollPosition = previewMenu.scrollLeft + 200;
    await previewMenu.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  protected renderPreviewArrows() {
    if (1 === this.sketchBook.sketches.length) {
      return html``;
    }

    const previewMenu = this.sketchFooter.querySelector('.horizontal-scroll-wrapper');
    if (previewMenu.scrollWidth <= previewMenu.clientWidth) {
      return html``;
    }

    let result;
    if (this.previewScrollPosition > 0) {
      result = html`
        <button
          @click=${this.movePreviewsToLeft}
          class="left-previews arrow-button"
        ><</button>
      `
    }

    if ((this.previewScrollPosition + previewMenu.clientWidth) < previewMenu.scrollWidth) {
      result = html`
        ${result}
        <button
          @click=${this.movePreviewsToRight}
          class="right-previews arrow-button"
        >>
        </button>
      `
    }

    return result;
  }

  protected render() {
    return html`
      <menu class="brush-tools">
        <brush-options
          @linewidthchanged=${this.changeBrushLineWidth}
          @colorchanged=${this.changeBrushColor}
        ></brush-options>
      </menu>

      <aside class="sketch-book-controls">
        <add-sketch
          @sketchadded=${this.appendSketch}
        ></add-sketch>
      </aside>

      <main>
        <div class="horizontal-scroll-wrapper">
          ${this.sketchBook.sketches.map((sketch: Sketch) => {
            return html`
              <div class="sketches">
                <div class="sketch">
                  <sketch-canvas
                    class="sketch-${sketch.id}"
                    .lineWidth=${this.brush.lineWidth}
                    .color=${this.brush.color}
                    data-id=${sketch.id}
                    @sketchbooksaved=${this.saveSketchBook}
                  ></sketch-canvas>
                </div>
              </div>
            `;
          })}
        </div>
      </main>

      <footer class="app-footer">
        <div  class="horizontal-scroll-wrapper">
          ${this.sketchBook.sketches.map((sketch: Sketch) => {
            return html`
              <div class="sketches">
                <sketch-preview
                  .sketchId=${sketch.id}
                  .image=${sketch.image}
                  @sketchselected=${this.goToSelectedSketch}
                ></sketch-preview>
              </div>
            `;
          })}
        </div>
        ${this.renderPreviewArrows()}
      </footer>
    `;
  }
}
