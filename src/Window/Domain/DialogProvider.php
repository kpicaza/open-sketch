<?php

declare(strict_types=1);

namespace OpenSketch\Window\Domain;

interface DialogProvider
{
    public function open(): string;
    public function save(): ?string;
}
