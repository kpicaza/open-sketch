import {SketchBook} from "../domain/model/SketchBook";
import {SketchBookRepository} from "../domain/SketchBookRepository";

const sketchBookRepository = new SketchBookRepository();

export const loadSketchBook = async (sketchBookId: string) => {
  return await sketchBookRepository.get(sketchBookId);
}

export const saveSketchBook = async (sketchBook: SketchBook)  => {
  await sketchBookRepository.save(sketchBook);
}
