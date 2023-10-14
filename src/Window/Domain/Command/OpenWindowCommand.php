<?php

declare(strict_types=1);

namespace OpenSketch\Window\Domain\Command;

final class OpenWindowCommand
{
    public function __construct(
        public readonly string $sketchBookId,
        public readonly string $openingWindowName,
        public readonly string $path,
        public readonly string $routeName,
    ) {
    }

    public function fileName(): string
    {
        return basename($this->path);
    }
}
