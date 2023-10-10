<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

use JsonSerializable;

class SketchBook implements JsonSerializable
{
    /** @param Sketch[] $sketches */
    public function __construct(
        private string $id,
        private array $sketches
    ) {
        if ([] === $this->sketches) {
            $this->sketches = [[
                'id' => 1,
                'image' => 'data:,'
            ]];
        }
    }

    /** @return Sketch[] */
    public function sketches(): array
    {
        return $this->sketches;
    }

    public function id(): string
    {
        return $this->id;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'sketches' => $this->sketches,
        ];
    }
}
