import {Sketch} from "./Sketch.js";
import {Brush} from "./Brush.js";
import {Palette} from "./Palette.js";

export interface SketchBook {
  id: string,
  sketches: Array<Sketch>,
  brush: Brush,
  palette: Palette,
}

export const defaultSketchBook = (): SketchBook => ({
    id: "",
    sketches: [
      {
        id: 1,
        image: new URL("data:,"),
      }
    ],
    brush: {
      width: 3,
      type: 'pen'
    },
    palette: {
      primaryColor: '#484545',
      backgroundColor: '#ffffff',
      secondaryColor1: '#527474',
      secondaryColor2: '#844ab2',
      secondaryColor3: '#e89cb9',
    },
  } as SketchBook)
