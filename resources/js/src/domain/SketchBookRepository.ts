import {SketchBook} from "./model/SketchBook";

export class SketchBookRepository
{
  public async save(sketchBook: SketchBook) {
    const response = await fetch('/api/sketch-books/', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(sketchBook),
    });
  }
}
