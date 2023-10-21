import container from "../services/ServiceContainer.js";
import {OpenSketch} from "./OpenSketch.js";

container.init();

customElements.define('open-sketch', OpenSketch);
