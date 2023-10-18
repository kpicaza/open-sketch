<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\GD;

use Illuminate\Support\Facades\Storage;
use OpenSketch\SketchBook\Domain\ImageManipulation;

final class PNGImageManipulation implements ImageManipulation
{
    public function make(string $base64Image, string $storagePath): void
    {
        list(, $data) = explode(';', $base64Image);
        list(, $data) = explode(',', $data);

        Storage::put($storagePath, base64_decode($data));
    }
}
