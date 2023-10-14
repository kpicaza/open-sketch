<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

final class Sketch
{
    public function __construct(
        public readonly int $id,
        public readonly string $image
    ) {
    }

    /**
     * @param array<array{"id": string, "image": string}> $sketches
     * @return array<self>
     */
    public static function fromNormalizedSketches(array $sketches): array
    {
        $hydratedSketches = [];

        foreach ($sketches as $sketch) {
            $hydratedSketches[] = new self((int)$sketch['id'], $sketch['image']);
        }

        return $hydratedSketches;
    }
}
