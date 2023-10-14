<?php

declare(strict_types=1);

namespace OpenSketch\Window\Domain\Handler;

use OpenSketch\Window\Domain\Command\OpenWindowCommand;
use OpenSketch\Window\Domain\WindowProvider;

final class OpenWindow
{
    public function __construct(
        private readonly WindowProvider $provider
    ) {
    }

    public function handle(OpenWindowCommand $command): void
    {
        $this->provider->open($command);
    }
}
