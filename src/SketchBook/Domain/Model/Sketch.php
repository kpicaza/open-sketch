<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

class Sketch
{
    public function __construct(
        public readonly int $id,
        public readonly string $image
    ) {
    }
}
