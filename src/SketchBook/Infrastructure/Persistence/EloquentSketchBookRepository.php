<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Persistence;

use App\Models\SketchBook as PersistentSketchBook;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

class EloquentSketchBookRepository implements SketchBookRepository
{
    public function save(SketchBook $sketchBook): void
    {
        $persistentSketchBook = PersistentSketchBook::firstOrNew([
            'id' => $sketchBook->id(),
        ]);

        $changedSketch = $sketchBook->sketches()[array_key_first($sketchBook->sketches())];
        $newSketches = $persistentSketchBook->sketches;
        $newSketches[$changedSketch->id - 1] = $changedSketch;
        $persistentSketchBook->sketches = $newSketches;
        $persistentSketchBook->save();
    }
}
