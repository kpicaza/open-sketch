<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

class SketchBook
{
    /** @param Sketch[] $sketches */
    public function __construct(
        private string $id,
        private array $sketches
    ) {
    }

    /** @return Sketch[] */
    public function sketches(): array
    {
        return $this->sketches;
    }

    public function id(): string
    {
        return $this->id;
    }
}
