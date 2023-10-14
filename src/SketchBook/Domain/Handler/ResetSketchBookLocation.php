<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\ResetSketchBookLocationCommand;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final class ResetSketchBookLocation
{
    public function __construct(
        private readonly SketchBookRepository $repository
    ) {
    }

    public function handle(ResetSketchBookLocationCommand $command): string
    {
        $sketchBook = $this->repository->get($command->sketchBookId);

        $sketchBook = $sketchBook->updateStoragePath($command->storagePath);

        $this->repository->save($sketchBook);

        return $sketchBook->id;
    }
}
