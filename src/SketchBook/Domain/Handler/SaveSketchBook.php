<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final class SaveSketchBook
{
    public function __construct(
        private readonly SketchBookRepository $repository
    ) {
    }

    public function handle(SaveSketchBookCommand $command): void
    {
        $sketchBook = $this->repository->get($command->sketchBookId);

        $sketchBook->addBackground($command->background);
        $sketchBook->updateSketches(Sketch::fromNormalizedSketches(
            $command->sketches
        ));

        $this->repository->save($sketchBook);
    }
}
