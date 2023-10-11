<?php

namespace App\Listeners;

use App\Events\DocumentOpened;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;

class OpenDocumentWindow
{
    public function handle(DocumentOpened $event): void
    {
        $storagePath = Storage::disk('user_documents')->path('OpenSketch');
        Log::debug($storagePath);
        /** @var \Native\Laravel\Windows\WindowManager $window */
        $window = Window::getFacadeRoot();
        $path = Dialog::new()
            ->title('Open Sketch Book')
            ->asSheet()
            ->defaultPath($storagePath)
            ->open();

        if (null === $path) {
            return;
        }

        Window::open('welcome');
        Window::close('sketch-book');
        Window::open('sketch-book')
            ->hideMenu(false)
            ->route('sketch-book', json_decode(
                Storage::get(str_replace(
                    storage_path('app'),
                    '',
                    $path
                )),
                true
            ))
        ;
        $window->maximize('sketch-book');

        Window::close('welcome');
    }
}
