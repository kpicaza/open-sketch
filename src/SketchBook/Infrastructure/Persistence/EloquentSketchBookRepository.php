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

        $persistentSketchBook->sketches = $sketchBook->sketches();
        $persistentSketchBook->save();
    }
}
