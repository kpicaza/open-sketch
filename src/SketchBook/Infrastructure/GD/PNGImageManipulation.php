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

        $image = imagecreatefromstring(base64_decode($data));
        if (false === $image) {
            return;
        }

        $colorRGB = sscanf($background, "#%02x%02x%02x");
        ;
        if (null === $colorRGB) {
            return;
        }
        list($red, $green, $blue) = $colorRGB;

        $width  = imagesx($image);
        $height = imagesy($image);

        $finalImage = imagecreatetruecolor($width, $height);
        if (false === $finalImage) {
            return;
        }

        $color = imagecolorallocate($finalImage, (int)$red, (int)$green, (int)$blue);
        if (false === $color) {
            return;
        }
        imagefill($finalImage, 0, 0, $color);

        imagecopy($finalImage, $image, 0, 0, 0, 0, $width, $height);

        imagepng($finalImage, $storagePath, 0);
        imagedestroy($image);
        imagedestroy($finalImage);
    }
}
