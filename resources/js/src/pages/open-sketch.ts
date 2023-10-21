import container from '../services/ServiceContainer';
import {OpenSketch} from "./OpenSketch";

container.init();

customElements.define('open-sketch', OpenSketch);
