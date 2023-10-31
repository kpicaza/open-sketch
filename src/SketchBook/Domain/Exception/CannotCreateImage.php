<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Exception;

use RuntimeException;

class CannotCreateImage extends RuntimeException
{
    public static function withMessage(string $message): self
    {
        return new self($message);
    }
}
