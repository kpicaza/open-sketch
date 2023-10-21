import {Sketch} from "./Sketch.js";

export interface SketchBook {
  id: string,
  sketches: Array<Sketch>,
  background: string,
}
