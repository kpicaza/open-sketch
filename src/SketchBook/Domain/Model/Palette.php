<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

/**
 * @phpstan-type PaletteNormalized array{
 *   primaryColor: string,
 *   backgroundColor: string,
 *   secondaryColor1: string,
 *   secondaryColor2: string,
 *   secondaryColor3: string,
 * }
 */
final class Palette
{
    private const DEFAULT_COLOR = '#000000';
    private const DEFAULT_BACKGROUND = '#ffffff';
    private const DEFAULT_SECONDARY_1 = '#00ffff';
    private const DEFAULT_SECONDARY_2 = '#ff00ff';
    private const DEFAULT_SECONDARY_3 = '#ffff00';

    public function __construct(
        public readonly string $primaryColor,
        public readonly string $backgroundColor,
        public readonly string $secondaryColor1,
        public readonly string $secondaryColor2,
        public readonly string $secondaryColor3,
    ) {
    }

    public static function default(): self
    {
        return new self(
            self::DEFAULT_COLOR,
            self::DEFAULT_BACKGROUND,
            self::DEFAULT_SECONDARY_1,
            self::DEFAULT_SECONDARY_2,
            self::DEFAULT_SECONDARY_3,
        );
    }

    /** @param PaletteNormalized $palette */
    public static function fromNormalized(array $palette): self
    {
        return new self(
            $palette['primaryColor'],
            $palette['backgroundColor'],
            $palette['secondaryColor1'],
            $palette['secondaryColor2'],
            $palette['secondaryColor3'],
        );
    }
}
