<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final class CreateNewSketchBook
{
    public function __construct(
        private readonly SketchBookRepository $repository
    ) {
    }

    public function handle(CreateNewSketchBookCommand $command): void
    {
        $sketchBook = SketchBook::new(
            $command->sketchBookId,
            $command->storagePath
        );

        $this->repository->save($sketchBook);
    }
}
