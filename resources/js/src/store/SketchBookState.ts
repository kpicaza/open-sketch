import {Sketch} from "../domain/model/Sketch";
import {SketchBook} from "../domain/model/SketchBook";
import {SketchBookRepository} from "../domain/SketchBookRepository";

export interface SketchBookState {
  id?: string,
  sketches: Array<Sketch>
}

export const sketchBookState: SketchBookState = {
  sketches: [
    {
      id: 1,
      image: new URL("data:,")
    }
  ]
} as SketchBookState

const sketchBookRepository = new SketchBookRepository();

export const saveSketchBook = async (state: SketchBookState, sketchBook: SketchBook)  => {
  state.id = sketchBook.id;
  state.sketches = sketchBook.sketches;
  await sketchBookRepository.save(sketchBook);
}
