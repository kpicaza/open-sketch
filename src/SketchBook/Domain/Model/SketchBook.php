<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

use JsonSerializable;
use Ramsey\Uuid\Uuid;

/**
 * @phpstan-import-type SketchNormalized from Sketch
 * @phpstan-import-type BrushNormalized from Brush
 * @phpstan-import-type PaletteNormalized from Palette
 * @phpstan-type SketchBookNormalized array{
 *   id: string,
 *   storage_path: string,
 *   sketches: array<SketchNormalized>,
 *   brush: BrushNormalized,
 *   palette: PaletteNormalized,
 * }
 */
final class SketchBook implements JsonSerializable
{
    /** @param Sketch[] $sketches */
    public function __construct(
        public readonly string $id,
        public readonly string $storagePath,
        private array $sketches,
        private Brush $brush,
        private Palette $palette
    ) {
    }

    public static function new(string $sketchBookId, string $storagePath): self
    {
        if (!str_ends_with($storagePath, '.json')) {
            $storagePath = sprintf('%s.json', $storagePath);
        }

        return new self(
            $sketchBookId,
            $storagePath,
            [
                new Sketch(1, 'data:,')
            ],
            Brush::default(),
            Palette::default()
        );
    }

    private function openedInNewLocation(string $id, string $storagePath): self
    {
        return new self(
            $id,
            $storagePath,
            $this->sketches,
            $this->brush,
            $this->palette
        );
    }

    /** @return Sketch[] */
    public function sketches(): array
    {
        return $this->sketches;
    }

    /** @param array<Sketch> $sketches */
    public function updateSketches(array $sketches): void
    {
        $this->sketches = $sketches;
    }

    public function updateStoragePath(string $storagePath): self
    {
        if ($storagePath === $this->storagePath) {
            return $this;
        }

        return $this->openedInNewLocation(Uuid::uuid4()->toString(), $storagePath);
    }

    public function name(): string
    {
        return basename(str_replace('.json', '', $this->storagePath));
    }

    public function background(): string
    {
        return $this->palette->backgroundColor;
    }

    public function setBrush(Brush $brush): void
    {
        $this->brush = $brush;
    }

    public function setPalette(Palette $palette): void
    {
        $this->palette = $palette;
    }

    /**
     * @return  array{
     *   id: string,
     *   storage_path: string,
     *   sketches: array<Sketch>,
     *   brush: Brush,
     *   palette: Palette,
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'storage_path' => $this->storagePath,
            'sketches' => $this->sketches,
            'brush' => $this->brush,
            'palette' => $this->palette,
        ];
    }
}
