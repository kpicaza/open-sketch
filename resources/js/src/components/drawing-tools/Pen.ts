import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('brush-pen')
export class Pen extends LitElement {
  static styles = css`
    #pencil_wrapper {
      display: block;
      position: absolute;
      top: 12px;
      left: 12px;
      width: 50px;
      margin-left: 100px;
    }

    .shaft {
      position: relative;
      left: -12px;
      top: 0;
      width: 45px;
      border-bottom-left-radius: -30px;
      border-bottom-right-radius: -30px;
      z-index: 1;
    }

    .shaft {
      top: 0;
      height: 175px;
    }

    .point {
      position: relative;
      top: 0px;
      left: -12px;
      width: 0;
      height: 0;
      border-top: solid 40px rgb(72, 72, 72, 1);
      border-right: solid 22.5px rgba(72, 72, 72, 0);
      border-left: solid 22.5px rgba(72, 72, 72, 0);
    }

    .point:after {
      position: absolute;
      content: "";
      top: -45px;
      left: -15px;
      width: 30px;
      height: 45px;
      background: linear-gradient(to right, rgba(51, 50, 50, 0.65) 0%, rgb(172, 172, 171) 40%, rgba(98, 98, 98, 0.5) 85%, rgb(137, 137, 136) 100%);
      border-radius: 50% / 0% 0% 80% 80%;
    }

    .lead {
      position: relative;
      top: -10px;
      left: 3px;
      width: 0;
      height: 0;
      border-top: solid 18px #000000;
      border-right: solid 7px rgba(255, 255, 255, 0);
      border-left: solid 7px rgba(255, 255, 255, 0);
      z-index: 1;
    }

    .lead:before {
      position: absolute;
      content: "";
      top: -13px;
      left: -5px;
      border-top: solid 10px rgba(255, 255, 255, .6);
      border-right: solid 0 rgba(0, 255, 0, 0);
      border-left: solid 5px rgba(255, 255, 255, 0);
    }

    #pencil_wrapper.green .shaft {
      background: linear-gradient(to right, rgba(23, 23, 23, 0.65) 0%, rgb(127, 127, 126) 40%, rgba(55, 54, 54, 0.5) 85%, rgb(90, 90, 89) 100%);
      border-bottom: solid 6px #333232A5;
    }

    .pencil_box.selected #pencil_wrapper.green .shaft {
      background: linear-gradient(to right, rgba(113, 113, 113, 0.65) 0%, rgb(200, 200, 200) 40%, rgba(169, 169, 169, 0.5) 85%, rgb(183, 183, 183) 100%);
      border-bottom: solid 6px #333232A5;
    }

    .pencil_box.selected .point:after {
      background: linear-gradient(to right, rgba(72, 71, 71, 0.65) 0%, rgb(197, 197, 196) 40%, rgba(128, 128, 128, 0.5) 85%, rgb(165, 165, 164) 100%);
      border-radius: 50% / 0% 0% 80% 80%;
    }

  `;

  @query('.pencil_box') pencilBox: HTMLDivElement;

  @property() declare selection: string;

  constructor() {
    super();
    this.selection = '';
  }

  private select() {
    this.pencilBox.classList.add('selected');
  }

  protected render(): unknown {
    return html`
      <div
        class="pencil_box ${this.selection === 'pen' ? 'selected' : '' }"
        @click=${this.select}
        @keyup=${this.select}
      >
        <div id="pencil_wrapper" class="green">
          <div class="shaft"></div>
          <div class="point"></div>
          <div class="lead"></div>
        </div>
      </div>
    `;
  }
}
