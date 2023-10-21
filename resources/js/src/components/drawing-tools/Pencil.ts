import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('brush-pencil')
export class Pencil extends LitElement {
  static styles = css`
    #pencil_wrapper {
      display: block;
      position: absolute;
      top: 20px;
      left: 12px;
      width: 50px;
      margin-left: 100px;
    }

    .shaft {
      position: relative;
      top: 0;
      width: 21px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      z-index: 1;
    }

    .shaft:before,
    .shaft:after {
      position: absolute;
      content: "";
      width: 10px;
    }

    .shaft,
    .shaft:before,
    .shaft:after {
      top: 0;
      height: 175px;
    }

    .shaft:before {
      left: -12px;
      border-top-left-radius: 4px;
      border-bottom-right-radius: 10px;
    }

    .shaft:after {
      left: 21px;
      border-top-right-radius: 2px;
      border-bottom-left-radius: 8px;
    }

    .point {
      position: relative;
      top: -2px;
      left: -12px;
      width: 0;
      height: 0;
      border-top: solid 40px rgb(86, 86, 86);
      border-right: solid 22.5px rgba(202, 176, 147, 0);
      border-left: solid 22.5px rgba(202, 176, 147, 0);
    }

    .point:before {
      position: absolute;
      content: "";
      top: -50px;
      left: -18px;
      width: 35px;
      height: 10px;
      background: rgb(137, 137, 136, 1);
    }

    .point:after {
      position: absolute;
      content: "";
      top: -49px;
      left: -15px;
      width: 30px;
      height: 40px;
      background: linear-gradient(to right, rgba(51, 50, 50, 0.65) 0%, rgb(172, 172, 171) 40%, rgba(98, 98, 98, 0.5) 85%, rgb(137, 137, 136) 100%);
      border-radius: 50% / 0% 0% 80% 80%;
    }

    .lead {
      position: relative;
      top: -14px;
      left: 3px;
      width: 0;
      height: 0;
      border-top: solid 13px #000000;
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

    .lead:after {
      position: absolute;
      top: -80px;
      left: -53px;
      width: 105px;
      display: block;
    }

    #pencil_wrapper.green .shaft {
      background-color: #4d4d4d;
      border-bottom: solid 6px #4d4d4d;
    }

    #pencil_wrapper.green .shaft:before {
      background-color: #6b6b6b;
      border-right: solid 2px #6b6b6b;
      border-bottom: solid 4px #6b6b6b;
      border-left: solid thin #4c4c4c;
    }

    #pencil_wrapper.green .shaft:after {
      background-color: #3f3f3f;
      border-right: solid 1px #272727;
      border-bottom: solid 4px #3f3f3f;
      border-left: solid thin #3f3f3f;
    }

    .pencil_box.selected #pencil_wrapper.green .shaft {
      background-color: #898989;
      border-bottom: solid 6px #898989;
    }

    .pencil_box.selected #pencil_wrapper.green .shaft:before {
      background-color: #a9a7a7;
      border-right: solid 2px #a9a7a7;
      border-bottom: solid 4px #a9a7a7;
      border-left: solid thin #898989;
    }

    .pencil_box.selected #pencil_wrapper.green .shaft:after {
      background-color: #747373;
      border-right: solid 1px #5a5959;
      border-bottom: solid 4px #747373;
      border-left: solid thin #747373;
    }

    .pencil_box.selected .point:after {
      background: linear-gradient(to right, rgba(97, 95, 95, 0.65) 0%, rgb(216, 216, 216) 40%, rgba(153, 153, 153, 0.5) 85%, rgb(190, 190, 190) 100%);
    }

  `;

  @query('.pencil_box') pencilBox: HTMLDivElement;
  @property() declare selection: string;

  constructor() {
    super();
    this.selection = '';
  }

  private select(event: MouseEvent) {
    this.pencilBox.classList.add('selected');
  }

  protected render(): unknown {
    return html`
      <div
        class="pencil_box ${this.selection === 'pencil' ? 'selected' : '' }"
        @click=${this.select}
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
