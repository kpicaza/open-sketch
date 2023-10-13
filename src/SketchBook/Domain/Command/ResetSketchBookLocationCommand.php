<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Command;

final readonly class ResetSketchBookLocationCommand
{
    private function __construct(
        public string $sketchBookId,
        public string $storagePath
    ) {
    }

    public static function withIdAndPath(string $sketchBookId, string $storagePath): self
    {
        return new self($sketchBookId, $storagePath);
    }
}
