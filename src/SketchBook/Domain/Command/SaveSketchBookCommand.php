<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Command;

use OpenSketch\SketchBook\Domain\Model\Brush;
use OpenSketch\SketchBook\Domain\Model\Palette;
use OpenSketch\SketchBook\Domain\Model\Sketch;

/**
 * @phpstan-import-type SketchNormalized from Sketch
 * @phpstan-import-type BrushNormalized from Brush
 * @phpstan-import-type PaletteNormalized from Palette
 */
final class SaveSketchBookCommand
{
    /**
     * @param array<SketchNormalized> $sketches
     * @param BrushNormalized $brush
     * @param PaletteNormalized $palette
     */
    private function __construct(
        public string $sketchBookId,
        public array $sketches,
        public array $brush,
        public array $palette,
    ) {
    }

    /**
     * @param array<SketchNormalized> $sketches
     * @param BrushNormalized $brush
     * @param PaletteNormalized $palette
     */
    public static function from(string $sketchBookId, array $sketches, array $brush, array $palette): self
    {
        return new self(
            $sketchBookId,
            $sketches,
            $brush,
            $palette
        );
    }

    public function brush(): Brush
    {
        return Brush::fromNormalized($this->brush);
    }

    public function palette(): Palette
    {
        return Palette::fromNormalized($this->palette);
    }
}
