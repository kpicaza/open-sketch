<?php

namespace OpenSketch\SketchBook\Domain\Command;

class SaveSketchBookCommand
{
    /** @param array<array{id: string, image: string}> $sketches */
    private function __construct(
        public string $sketchBookId,
        public array $sketches,
        public string $background,
    ) {
    }

    /** @param array<array{id: string, image: string}> $sketches */
    public static function from(string $sketchBookId, array $sketches, string $background): self
    {
        return new self($sketchBookId, $sketches, $background);
    }
}
