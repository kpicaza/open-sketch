<?php

namespace OpenSketch\SketchBook\Domain\Command;

class SaveSketchBookCommand
{
    /** @param array{id: string, image: string} $sketches */
    private function __construct(
        public string $sketchBookId,
        public array $sketches,
    ) {
    }

    /** @param array{id: string, image: string} $sketches */
    public static function withIdAndSketches(string $sketchBookId, array $sketches): self
    {
        return new self($sketchBookId, $sketches);
    }

}
