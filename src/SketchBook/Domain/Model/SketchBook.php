<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

use JsonSerializable;
use OpenSketch\SketchBook\Domain\Exception\StoragePathChanged;
use Ramsey\Uuid\Uuid;

final class SketchBook implements JsonSerializable
{
    /** @param Sketch[] $sketches */
    public function __construct(
        public readonly string $id,
        public string $storagePath,
        private array $sketches
    ) {
        if ([] === $this->sketches) {
            $this->sketches = [
                new Sketch(1, 'data:,')
            ];
        }
    }

    private function openedInNewLocation(string $id, string $storagePath): self
    {
        return new self(
            $id,
            $storagePath,
            $this->sketches
        );
    }

    /** @return Sketch[] */
    public function sketches(): array
    {
        return $this->sketches;
    }

    /** @param array<Sketch> $sketches */
    public function updateSketches(array $sketches): void
    {
        $this->sketches = $sketches;
    }

    public function updateStoragePath(string $storagePath): self
    {
        if ($storagePath === $this->storagePath) {
            return $this;
        }

        return $this->openedInNewLocation(Uuid::uuid4()->toString(), $storagePath);
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'storage_path' => $this->storagePath,
            'sketches' => $this->sketches,
        ];
    }

    public function name(): string
    {
        return basename(str_replace('.json', '', $this->storagePath));
    }
}
