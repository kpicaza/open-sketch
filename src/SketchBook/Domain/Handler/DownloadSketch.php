<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\DownloadSketchCommand;
use OpenSketch\SketchBook\Domain\ImageManipulation;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use OpenSketch\Window\Domain\DialogProvider;

final class DownloadSketch
{
    public function __construct(
        private readonly SketchBookRepository $repository,
        private readonly DialogProvider $dialogProvider,
        private readonly ImageManipulation $imageManipulation,
    ) {
    }

    public function handle(DownloadSketchCommand $from): void
    {
        $sketchBook = $this->repository->get($from->sketchBookId);

        $storagePath = $this->dialogProvider->save(
            'Export Sketch',
            sprintf('%s-%s.png', $sketchBook->name(), $from->sketchId)
        );

        if (empty($storagePath)) {
            return;
        }

        $this->imageManipulation->make(
            $sketchBook->sketches()[$from->sketchId - 1]->image,
            $storagePath,
            $sketchBook->background()
        );
    }
}
