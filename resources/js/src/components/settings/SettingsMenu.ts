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
import {disableFeature, enableFeature} from "../../store/FeatureFlags";
import { featuresContext} from "../../store/AppContext";
import {consume} from "@lit/context";
import {openFile, saveFile} from "../../store/SketchBookState";
import {get} from "lit-translate";
import {langs} from "../../lang/Langs";

@customElement('settings-menu')
export class SettingsMenu extends LitElement {
  static styles = css`
    md-menu-item {
      min-width: 280px;
    }

    md-filled-icon-button {
      --md-filled-icon-button-container-width: 45px;
      --md-filled-icon-button-container-height: 45px;
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
    this.dispatchEvent(new Event('restartrequired'))
  }

  private async changeLanguage(lang: string) {
    await fetch(
      '/api/langs/' + lang,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    );

    this.dispatchEvent(new Event('restartrequired'))
  }


  private langSection() {
    return html`
    <md-sub-menu>
      <md-menu-item slot="item">
        <div slot="headline">${get('lang')}</div>
        <md-icon slot="start">arrow_left</md-icon>
      </md-menu-item>
      <md-menu
        slot="menu"
        .stayOpenOnFocusout=${true}
        .stayOpenOnOutsideClick=${true}
      >
        ${langs.map((lang) => {
          return html`
            <md-menu-item
              @click=${this.changeLanguage.bind(this, lang)}
            >
              <div slot="headline">${get(lang)}</div>
              <md-icon slot="start">lang</md-icon>
            </md-menu-item>
          `;
        })}
        <div class="requires-restart">
          <md-icon>info</md-icon>
          <div class="icon-align-text">${get('restart')}</div>
        </div>
      </md-menu>
    </md-sub-menu>
  `;
  }

  private experimentalSection() {
    return html`
      <md-sub-menu>
        <md-menu-item slot="item">
          <div slot="headline">${get('experimental')}</div>
          <md-icon slot="start">arrow_left</md-icon>
        </md-menu-item>
        <md-menu
          slot="menu"
          .stayOpenOnFocusout=${true}
          .stayOpenOnOutsideClick=${true}
        >
          <md-menu-item class="features"
                        .keepOpen=${true}
          >
            <div slot="headline">${get('available')}</div>
            <md-icon slot="start">outlined_flag</md-icon>
          </md-menu-item>
          <md-divider></md-divider>
          ${this.features.map((feature) => {
            return html`
              <md-menu-item class="features"
                            .keepOpen=${true}
              >
                <div slot="headline">${get('feature.' + feature.id)}</div>
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
            <div class="icon-align-text">${get('restart')}</div>
          </div>
          <md-divider></md-divider>
          <md-menu-item
            href="https://github.com/kpicaza/open-sketch/issues/new/choose"
            target="_blank"
          >
            <div slot="headline">${get('feedback')}</div>
            <md-icon slot="start">campaign</md-icon>
            <md-icon slot="end">open_in_new</md-icon>
          </md-menu-item>
        </md-menu>
      </md-sub-menu>
    `
  }

  protected render() {
    return html`
      <md-filled-icon-button
        id="settings-menu-button"
        @click=${this.openMenu}
      >
        <md-icon>settings</md-icon>
      </md-filled-icon-button>

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
          <div slot="headline">${get('settings')}</div>
          <md-icon slot="start">settings</md-icon>
        </md-menu-item>
        <md-menu-item @click=${saveFile}>
          <div slot="headline">${get('add_sketch_book')}</div>
          <md-icon slot="start">add</md-icon>
        </md-menu-item>
        <md-menu-item @click=${openFile}>
          <div slot="headline">${get('open_sketch_book')}</div>
          <md-icon slot="start">folder_open</md-icon>
        </md-menu-item>
        ${this.experimentalSection()}
        ${this.langSection()}
        <md-menu-item
          href="https://github.com/kpicaza/open-sketch"
          target="_blank"
        >
          <div slot="headline">${get('contribute')}</div>
          <md-icon slot="start">diversity_3</md-icon>
          <md-icon slot="end">open_in_new</md-icon>
        </md-menu-item>
      </md-menu>
    `
  }
}
