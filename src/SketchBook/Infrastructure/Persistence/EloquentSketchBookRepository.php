<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Persistence;

use App\Models\SketchBook as PersistentSketchBook;
use OpenSketch\SketchBook\Domain\Model\Sketch;
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

    public function get(string $sketchBookId): SketchBook
    {
        $persistentSketchBook = PersistentSketchBook::firstOrNew([
            'id' => $sketchBookId,
        ]);
        if (null === $persistentSketchBook) {
            throw new \Exception('Sketch Book not found.');
        }

        return new SketchBook(
            $persistentSketchBook->id,
            array_map(
                static fn(array $sketch) => new Sketch($sketch['id'], $sketch['image']),
                $persistentSketchBook->sketches?->toArray() ?? []
            )
        );
    }
}
