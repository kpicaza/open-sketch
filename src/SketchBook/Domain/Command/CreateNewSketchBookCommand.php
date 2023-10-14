<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Command;

final class CreateNewSketchBookCommand
{
    private function __construct(
        public readonly string $sketchBookId,
        public readonly string $storagePath
    ) {
    }

    public static function withIdAndPath(string $sketchBookId, string $storagePath): self
    {
        return new self($sketchBookId, $storagePath);
    }
}
