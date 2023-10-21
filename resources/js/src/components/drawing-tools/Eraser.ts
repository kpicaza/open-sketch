import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('brush-eraser')
export class Eraser extends LitElement {
  static styles = css`
    .eraser-wrapper {
      transform: rotate(90);
      width: 40px;
      height: 23vmin;
      border-radius: 1vmin;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(#7ea246 4%, #464646 5%, #6b6b6b 75%, #f7f7f7 76%, #f7f7f7 94%, #a7a7a7);
      position: relative;
      filter: drop-shadow(0 0 6px #a7a7a7);
      //
      .blob {
        width: 50vmin;
        height: 22vmin;
        background: #8fbd40;
        clip-path: circle(50% at 90% 120%);
        position: absolute;
        right: 0;
        top: -3.2vmin;
      }

      .text {
        position: absolute;
        right: 4vmin;
        font-family: 'Roboto', sans-serif;
        color: #fff;

        div {
          line-height: 1;
          position: relative;

          &:nth-child(1) {
            font-size: 4vmin;
            font-weight: 500;
            left: 1.8vmin;
            top: .6vmin;
            letter-spacing: 0.5vmin;
          }

          &:nth-child(2) {
            font-size: 5.5vmin;
            font-weight: 700;
            left: -2vmin;
            letter-spacing: 0.4vmin;
          }

          &:nth-child(3) {
            font-size: 3vmin;
            font-weight: 100;
            letter-spacing: .5vmin;
            color: #f3f3f3;
            left: 1vmin;
            top: -.5vmin;
          }
        }
      }

      .eraser {
        width: 15vmin;
        height: 23.5vmin;
        border-radius: 1vmin 0 0 1vmin;
        position: absolute;
        left: -14vmin;
        background: linear-gradient(#f8f7fb 2%, #dfe3ec 94%, #c0c4c7);
      }
    }

    .eraser-wrapper.selected {
      background: linear-gradient(#7ea246 4%, #6f6e6e 5%, #999898 75%, #f1efef 76%, #f7f7f7 94%, #a7a7a7);
    }

  `;

  @query('.eraser-wrapper') pencilBox: HTMLDivElement;
  @property() declare selection: string;

  constructor() {
    super();
    this.selection = '';
  }

  private select(event: MouseEvent) {
    this.pencilBox.classList.add('selected');
  }

  protected render() {
    return html`
      <div
        class="eraser-wrapper ${this.selection === 'eraser' ? 'selected' : '' }"
        @click=${this.select}
      >
        <!--   <div class="text">for neat & clean erasing</div> -->
        <div class="blob">
        </div>
        <div class="text">
        </div>
        <div class="eraser"></div>
      </div>
    `;
  }
}
