import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button';
import '@material/web/menu/menu.js';
import '@material/web/menu/sub-menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/icon/icon.js';
import '@material/web/switch/switch.js';
import '@material/web/divider/divider.js';
import {MdMenu, MdSwitch} from "@material/web/all";
import {Feature} from "../../types/Feature";
import {disableFeature, enableFeature} from "../../store/SketchBookState";
import { featuresContext} from "../../store/AppContext";
import {consume} from "@lit/context";

@customElement('settings-menu')
export class SettingsMenu extends LitElement {
  static styles = css`
    md-menu-item {
      min-width: 280px;
    }

    .requires-restart {
      display: none;
      font-size: 12px;
      margin-left: 10px;
    }

    .requires-restart md-icon {
      position: relative;
      color: #a24187;
    }

    .icon-align-text {
      position: absolute;
      display: inline-block;
      vertical-align: center;
      margin-top: 5px;
      margin-left: 15px;
      color: #a24187;
    }
  `;

  @query('#settings-menu') menu: MdMenu;
  @query('.requires-restart') requiresRestartMessage: HTMLDivElement;
  @consume({context: featuresContext, subscribe: true})
  @property({attribute: false})
  features?: Array<Feature>

  private openMenu(event: MouseEvent) {
    this.menu.open = !this.menu.open
  }
  private async enableFeature(event: Event) {
    const mdSwitch = event.target as MdSwitch;

    if (mdSwitch.selected) {
      await enableFeature(mdSwitch.value)
    } else {
      await disableFeature(mdSwitch.value)
    }

    this.requiresRestartMessage.style.display = 'block';
  }

  protected render() {
    return html`
      <div style="margin: 16px;">
        <md-filled-icon-button
          id="settings-menu-button"
          @click=${this.openMenu}
        >
          <md-icon>settings</md-icon>
        </md-filled-icon-button>
      </div>

      <!-- Note the has-overflow attribute -->
      <md-menu
        has-overflow
        id="settings-menu"
        anchor="settings-menu-button"
        .stayOpenOnFocusout=${true}
      >
        <md-menu-item
          .keepOpen=${true}
        >
          <div slot="headline">Settings</div>
          <md-icon slot="start">settings</md-icon>
        </md-menu-item>
        <md-sub-menu>
          <md-menu-item slot="item">
            <div slot="headline">Experimental</div>
            <md-icon slot="start">arrow_leftt</md-icon>
          </md-menu-item>
          <md-menu
            slot="menu"
            .stayOpenOnFocusout=${true}
            .stayOpenOnOutsideClick=${true}
          >
            <md-menu-item class="features"
                          .keepOpen=${true}
            >
              <div slot="headline">Available Features</div>
              <md-icon slot="start">outlined_flag</md-icon>
            </md-menu-item>
            <md-divider></md-divider>
            ${this.features.map((feature) => {
              return html`
                <md-menu-item class="features"
                              .keepOpen=${true}
                >
                  <div slot="headline">${feature.id}</div>
                  <md-switch
                    icons
                    slot="end"
                    @change=${this.enableFeature}
                    .selected=${feature.enabled}
                    .value=${feature.id}
                  ></md-switch>
                </md-menu-item>
              `;
            })}
            <div class="requires-restart">
              <md-icon>info</md-icon>
              <div class="icon-align-text">Restart Required</div>
            </div>
            <md-divider></md-divider>
            <md-menu-item
              href="https://github.com/kpicaza/open-sketch/issues/new/choose"
              target="_blank"
            >
              <div slot="headline">Feedback</div>
              <md-icon slot="start">campaign</md-icon>
              <md-icon slot="end">open_in_new</md-icon>
            </md-menu-item>
          </md-menu>
        </md-sub-menu>
        <md-menu-item
          href="https://github.com/kpicaza/open-sketch"
          target="_blank"
        >
          <div slot="headline">Contribute</div>
          <md-icon slot="start">diversity_3</md-icon>
          <md-icon slot="end">open_in_new</md-icon>
        </md-menu-item>
      </md-menu>
    `
  }
}
