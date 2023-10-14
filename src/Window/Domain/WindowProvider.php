<?php

declare(strict_types=1);

namespace OpenSketch\Window\Domain;

use OpenSketch\Window\Domain\Command\OpenWindowCommand;

interface WindowProvider
{
    public function open(OpenWindowCommand $command): void;
}
