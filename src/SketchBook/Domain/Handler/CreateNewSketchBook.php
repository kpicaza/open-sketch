<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final readonly class CreateNewSketchBook
{
    public function __construct(
        private SketchBookRepository $repository
    ) {
    }

    public function handle(CreateNewSketchBookCommand $command): void
    {
        $sketchBook = new SketchBook(
            $command->sketchBookId,
            $command->storagePath,
            []
        );

        $this->repository->save($sketchBook);
    }
}
