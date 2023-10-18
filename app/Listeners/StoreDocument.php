<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\DocumentSaved;
use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Handler\CreateNewSketchBook;
use OpenSketch\Window\Domain\Command\OpenWindowCommand;
use OpenSketch\Window\Domain\Handler\SaveFileDialog;
use OpenSketch\Window\Domain\Handler\OpenWindow;
use Ramsey\Uuid\Uuid;

final class StoreDocument
{
    public function __construct(
        private readonly CreateNewSketchBook $createNewSketchBook,
        private readonly OpenWindow $windowManager,
        private readonly SaveFileDialog $saveDialog
    ) {
    }

    public function handle(DocumentSaved $event): void
    {
        $path = $this->saveDialog->handle('save_sketch_book', 'OpenSketch');

        if (null === $path) {
            return;
        }

        $command = CreateNewSketchBookCommand::withIdAndPath(
            Uuid::uuid4()->toString(),
            $path
        );

        $this->createNewSketchBook->handle($command);

        $this->windowManager->handle(new OpenWindowCommand(
            $command->sketchBookId,
            'sketch-book',
            $path,
            'sketch-book',
        ));
    }
}
