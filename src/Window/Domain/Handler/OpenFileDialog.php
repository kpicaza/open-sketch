<?php

declare(strict_types=1);

namespace OpenSketch\Window\Domain\Handler;

use OpenSketch\Window\Domain\DialogProvider;

final class OpenFileDialog
{
    public function __construct(
        private readonly DialogProvider $provider
    ) {
    }

    public function handle(): string
    {
        return $this->provider->open();
    }
}
