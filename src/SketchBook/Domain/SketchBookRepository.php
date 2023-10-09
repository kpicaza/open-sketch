<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain;

use OpenSketch\SketchBook\Domain\Model\SketchBook;

interface SketchBookRepository
{
    public function save(SketchBook $sketchBook): void;
}
