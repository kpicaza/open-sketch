<?php

namespace OpenSketch\SketchBook\Domain;

interface ImageManipulation
{
    public function make(string $base64Image, string $storagePath): void;
}
