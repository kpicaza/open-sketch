import {SketchBook} from "../domain/model/SketchBook";
import {SketchBookRepository} from "../domain/SketchBookRepository";
import {Feature} from "../types/Feature";

const sketchBookRepository = new SketchBookRepository();

export const loadSketchBook = async (sketchBookId: string) => {
  return await sketchBookRepository.get(sketchBookId);
}

export const saveSketchBook = async (sketchBook: SketchBook) => {
  await sketchBookRepository.save(sketchBook);
}

export const downloadSketch = async (sketchBookId: string, sketchId: string) => {
  await fetch(
    '/api/sketch-books/' + sketchBookId + '/exports/' + sketchId,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
}

export const featuresAvailable = async () => {
  const response = (await fetch(
    '/api/features',
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  ));

  return await response.json() as Array<Feature>;
}

export const enableFeature = async (feature: string) => {
  const response = await fetch(
    '/api/features/' + feature,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        "action": "enable_feature",
      })
    }
  );
}

export const disableFeature = async (feature: string) => {
  const response = await fetch(
    '/api/features/' + feature,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        "action": "disable_feature",
      })
    }
  );
}

