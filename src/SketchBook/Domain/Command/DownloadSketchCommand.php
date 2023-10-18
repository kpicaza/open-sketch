<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Command;

final class DownloadSketchCommand
{
    private function __construct(
        public readonly string $sketchBookId,
        public readonly int $sketchId,
    ) {
    }

    public static function from(string $sketchBookId, int $sketchId): self
    {
        return new self($sketchBookId, $sketchId);
    }
}
