<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\GD;

use Illuminate\Support\Facades\Storage;
use OpenSketch\SketchBook\Domain\ImageManipulation;

final class PNGImageManipulation implements ImageManipulation
{
    public function make(string $base64Image, string $storagePath, string $background): void
    {
        list(, $data) = explode(';', $base64Image);
        list(, $data) = explode(',', $data);

        $image = imagecreatefromstring($data);
        list($red, $green, $blue) = sscanf($background, "#%02x%02x%02x");

        $color = imagecolorallocatealpha($image, $red, $green, $blue, 0);
        $this->imagefillalpha($image, $color);
        imagepng($image);
        imagedestroy($image);

        Storage::put($storagePath, $image);
    }

    private function imageFillAlpha($image, $color): void
    {
        imagefilledrectangle($image, 0, 0, imagesx($image), imagesy($image), $color);
    }
}
