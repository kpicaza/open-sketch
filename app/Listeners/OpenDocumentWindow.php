<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\DocumentOpened;
use Illuminate\Support\Facades\Storage;
use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Command\ResetSketchBookLocationCommand;
use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Exception\MissedSketchBookReference;
use OpenSketch\SketchBook\Domain\Handler\CreateNewSketchBook;
use OpenSketch\SketchBook\Domain\Handler\ResetSketchBookLocation;
use OpenSketch\SketchBook\Domain\Handler\SaveSketchBook;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\Window\Domain\Command\OpenWindowCommand;
use OpenSketch\Window\Domain\Handler\OpenFileDialog;
use OpenSketch\Window\Domain\Handler\OpenWindow;
use Ramsey\Uuid\Uuid;

/**
 * @phpstan-import-type SketchBookNormalized from SketchBook
 */
final class OpenDocumentWindow
{
    private const JSON_DEPTH = 512;

    public function __construct(
        private readonly ResetSketchBookLocation $resetSketchBookLocation,
        private readonly CreateNewSketchBook $createNewSketchBook,
        private readonly SaveSketchBook $saveSketchBook,
        private readonly OpenWindow $openWindow,
        private readonly OpenFileDialog $openDialog
    ) {
    }

    public function handle(DocumentOpened $event): void
    {
        $path = $this->openDialog->handle();

        $fileContents = Storage::get($path);

        if (empty($fileContents)) {
            return;
        }

        /**
         * @var SketchBookNormalized $sketchBookData
         */
        $sketchBookData = json_decode(
            $fileContents,
            true,
            self::JSON_DEPTH,
            JSON_THROW_ON_ERROR
        );
        $command = ResetSketchBookLocationCommand::withIdAndPath(
            $sketchBookData['id'],
            $path
        );

        try {
            $sketchBookId = $this->resetSketchBookLocation->handle($command);
        } catch (MissedSketchBookReference) {
            $sketchBookId = Uuid::uuid4()->toString();
            $this->createNewSketchBook->handle(
                CreateNewSketchBookCommand::withIdAndPath(
                    $sketchBookId,
                    $path
                )
            );
            $this->saveSketchBook->handle(
                SaveSketchBookCommand::from(
                    $sketchBookId,
                    $sketchBookData['sketches'],
                    $sketchBookData['brush'],
                    $sketchBookData['palette'],
                )
            );
        }

        $this->openWindow->handle(
            new OpenWindowCommand(
                $sketchBookId,
                'sketch-book',
                $path,
                'sketch-book',
            )
        );
    }
}
