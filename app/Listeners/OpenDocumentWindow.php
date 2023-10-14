<?php

namespace App\Listeners;

use App\Events\DocumentOpened;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;
use OpenSketch\SketchBook\Domain\Command\ResetSketchBookLocationCommand;
use OpenSketch\SketchBook\Domain\Handler\ResetSketchBookLocation;

class OpenDocumentWindow
{
    public function __construct(
        private ResetSketchBookLocation $resetSketchBookLocation,
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

        $path = Storage::get(str_replace(
            storage_path('app'),
            '',
            $path
        ));

        if (null === $path || '' === $path) {
            return;
        }

        /** @var array{id: string, sketches: array<array{id: string, image: string}>} $sketchBookData */
        $sketchBookData = json_decode($path, true, 512, JSON_THROW_ON_ERROR);
        $command = ResetSketchBookLocationCommand::withIdAndPath(
            $sketchBookData['id'],
            $path
        );

        $sketchBookId =  $this->resetSketchBookLocation->handle($command);

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
