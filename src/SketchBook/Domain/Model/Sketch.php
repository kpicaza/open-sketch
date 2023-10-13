<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

final readonly class Sketch
{
    public function __construct(
        public int $id,
        public string $image
    ) {
    }
}
