<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final readonly class SaveSketchBook
{
    public function __construct(
        private SketchBookRepository $repository
    ) {
    }

    public function handle(SaveSketchBookCommand $command): void
    {
        $sketchBook = $this->repository->get($command->sketchBookId);

        $sketchBook->updateSketches(array_map(
            fn(array $sketch) => new Sketch((int)$sketch['id'], $sketch['image']),
            $command->sketches
        ));

        $this->repository->save($sketchBook);

    }
}
