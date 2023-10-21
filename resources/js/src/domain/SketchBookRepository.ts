import {SketchBook} from "./model/SketchBook.js";

export class SketchBookRepository
{
  public async save(sketchBook: SketchBook) {
    await fetch('/api/sketch-books/', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(sketchBook),
    });
  }

  public async get(sketchBookId: string): Promise<SketchBook> {
    const response = await fetch(`/api/sketch-books/${  sketchBookId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });

    return await response.json() as SketchBook;
  }
}
