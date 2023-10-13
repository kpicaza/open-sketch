<?php

namespace App\Listeners;

use App\Events\DocumentSaved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;
use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Handler\CreateNewSketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use Ramsey\Uuid\Uuid;

class StoreDocument
{
    public function __construct(
        private CreateNewSketchBook $createNewSketchBook
    ) {
    }

    public function handle(DocumentSaved $event): void
    {
        $storagePath = Storage::disk('user_documents')->path('OpenSketch');
        $path = Dialog::new()
            ->title('Save Sketch Book')
            ->asSheet('welcome')
            ->defaultPath($storagePath)
            ->save();

        if (null === $path) {
            return;
        }

        $command = CreateNewSketchBookCommand::withIdAndPath(
            Uuid::uuid4()->toString(),
            $path
        );

        $this->createNewSketchBook->handle($command);

        /** @var \Native\Laravel\Windows\WindowManager $window */
        $window = Window::getFacadeRoot();
        Window::open('welcome');
        Window::close('sketch-book');
        Window::open('sketch-book')
            ->hideMenu(false)
            ->route('sketch-book', [
                'id' => $command->sketchBookId,
            ])
        ;
        $window->maximize('sketch-book');

        Window::close('welcome');
    }
}
