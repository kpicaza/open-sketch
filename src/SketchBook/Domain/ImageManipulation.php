<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain;

use OpenSketch\SketchBook\Domain\Exception\CannotCreateImage;

interface ImageManipulation
{
    /** @throws CannotCreateImage */
    public function make(string $base64Image, string $storagePath, string $background): void;
}
