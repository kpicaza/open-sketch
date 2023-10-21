import {createContext} from '@lit/context';
import {SketchBook} from "../domain/model/SketchBook.js";
import {Brush} from "../domain/model/Brush.js";
import {ToggleRouter} from "../services/ToggleRouter.js";


const sketchBook: SketchBook = {
  sketches: [
    {
      id: 1,
      image: new URL("data:,")
    }
  ],
  background: '#d5e5d9'
} as SketchBook;

export const sketchBookContext = createContext<SketchBook>(sketchBook);

const brush: Brush = {
  lineWidth: 3,
  color: '#282828',
  type: 'pen'
} as Brush;

export const brushContext = createContext<Brush>(brush);

const features = new ToggleRouter([]);

export const featuresContext = createContext<ToggleRouter>(features);
