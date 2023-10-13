<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Persistence;

use App\Models\SketchBook as PersistentSketchBook;
use App\Models\SketchBookReference;
use Illuminate\Support\Facades\Storage;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final readonly class FileSystemSketchBookRepository implements SketchBookRepository
{
    public function save(SketchBook $sketchBook): void
    {
        $path = str_replace('.json', '', $sketchBook->storagePath()) . '.json';
        SketchBookReference::firstOrNew([
            'id' => $sketchBook->id,
            'storage_path' => $path,
        ])->save();

        Storage::put($path, json_encode($sketchBook, JSON_THROW_ON_ERROR));
    }

    public function get(string $sketchBookId): SketchBook
    {
        $sketchBookReference = SketchBookReference::firstOrNew([
            'id' => $sketchBookId,
        ]);

        if (null === $sketchBookReference->storage_path) {
            throw new \Exception('Sketch Book not found.');
        }

        $content = Storage::get($sketchBookReference->storage_path) ?? '[]';
        $sketchBookSerialized = json_decode($content, true, 512, JSON_THROW_ON_ERROR);


        return new SketchBook(
            $sketchBookReference->id,
            $sketchBookReference->storage_path,
            array_map(
                static fn(array $sketch) => new Sketch($sketch['id'], $sketch['image']),
                $sketchBookSerialized['sketches'] ?? []
            )
        );
    }
}
