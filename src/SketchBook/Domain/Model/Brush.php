<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

/**
 * @phpstan-type BrushNormalized array{type: string, width: float|int}
 */
final class Brush
{
    private const DEFAULT_TYPE = 'pen';
    private const DEFAULT_WIDTH = 3;

    public function __construct(
        public readonly string $type,
        public readonly float|int $width
    ) {
    }

    public static function default(): self
    {
        return new self(self::DEFAULT_TYPE, self::DEFAULT_WIDTH);
    }

    /** @param BrushNormalized $brush */
    public static function fromNormalized(array $brush): self
    {
        return new self(
            $brush['type'],
            $brush['width']
        );
    }
}
