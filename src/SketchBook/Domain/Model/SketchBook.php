<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Model;

use JsonSerializable;
use OpenSketch\SketchBook\Domain\Exception\StoragePathChanged;
use Ramsey\Uuid\Uuid;

final class SketchBook implements JsonSerializable
{
    public readonly string $storagePath;

    /** @param Sketch[] $sketches */
    public function __construct(
        public readonly string $id,
        string $storagePath,
        private array $sketches,
        private string $background = '#ffffff',
    ) {
        if ([] === $this->sketches) {
            $this->sketches = [
                new Sketch(1, 'data:,')
            ];
        }

        if (!str_ends_with($storagePath, '.json')) {
            $this->storagePath = sprintf('%s.json', $storagePath);
        } else {
            $this->storagePath = $storagePath;
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

    public function addBackground(string $background): void
    {
        $this->background = $background;
    }

    /**
     * @return  array{
     *   id: string,
     *   sketches: array<Sketch>,
     *   storage_path: string,
     *   background: string
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'storage_path' => $this->storagePath,
            'sketches' => $this->sketches,
            'background' => $this->background,
        ];
    }

    public function name(): string
    {
        return basename(str_replace('.json', '', $this->storagePath));
    }

    public function background(): string
    {
        return $this->background;
    }
}
