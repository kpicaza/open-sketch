<?php

namespace App\Listeners;

use App\Events\DocumentOpened;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;
use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Command\ResetSketchBookLocationCommand;
use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Exception\MissedSketchBookReference;
use OpenSketch\SketchBook\Domain\Handler\CreateNewSketchBook;
use OpenSketch\SketchBook\Domain\Handler\ResetSketchBookLocation;
use OpenSketch\SketchBook\Domain\Handler\SaveSketchBook;
use Ramsey\Uuid\Uuid;

class OpenDocumentWindow
{
    public function __construct(
        private ResetSketchBookLocation $resetSketchBookLocation,
        private CreateNewSketchBook $createNewSketchBook,
        private SaveSketchBook $saveSketchBook,
        private Dialog $dialog
    ) {
    }

    public function handle(DocumentOpened $event): void
    {
        $storagePath = Storage::disk('user_documents')->path('OpenSketch');
        $path = $this->dialog
            ->title('Open Sketch Book')
            ->asSheet('welcome')
            ->defaultPath($storagePath)
            ->open();

        $path = str_replace(
            storage_path('app'),
            '',
            $path
        );
        if ('' === $path) {
            return;
        }

        $fileContents = Storage::get($path);

        if (null === $fileContents || '' === $fileContents) {
            return;
        }

        /** @var array{id: string, sketches: array<array{id: string, image: string}>} $sketchBookData */
        $sketchBookData = json_decode($fileContents, true, 512, JSON_THROW_ON_ERROR);
        $command = ResetSketchBookLocationCommand::withIdAndPath(
            $sketchBookData['id'],
            $path
        );

        try {
            $sketchBookId =  $this->resetSketchBookLocation->handle($command);
        } catch (MissedSketchBookReference) {
            $sketchBookId = Uuid::uuid4()->toString();
            $this->createNewSketchBook->handle(CreateNewSketchBookCommand::withIdAndPath(
                $sketchBookId,
                $path
            ));
            $this->saveSketchBook->handle(SaveSketchBookCommand::withIdAndSketches(
                $sketchBookId,
                $sketchBookData['sketches'],
            ));
        }

        /** @var \Native\Laravel\Windows\WindowManager $window */
        $window = Window::getFacadeRoot();
        Window::open('welcome');
        Window::close('sketch-book');
        Window::open('sketch-book')
            ->hideMenu(false)
            ->route('sketch-book', ['id' => $sketchBookId])
        ;
        $window->maximize('sketch-book');

        Window::close('welcome');
    }
}
