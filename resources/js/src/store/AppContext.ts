import {createContext} from '@lit/context';
import {SketchBook} from "../domain/model/SketchBook";
import {Brush} from "../domain/model/Brush";
import {Feature} from "../types/Feature";


const sketchBook: SketchBook = {
  sketches: [
    {
      id: 1,
      image: new URL("data:,")
    }

  ]
} as SketchBook;

export const sketchBookContext = createContext<SketchBook>(sketchBook);

const brush: Brush = {
  lineWidth: 5,
  color: '#000000',
  type: 'pen'
} as Brush;

export const brushContext = createContext<Brush>(brush);

const features: Array<Feature> = [];

export const featuresContext = createContext<Array<Feature>>(features);
