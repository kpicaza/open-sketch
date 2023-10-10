<?php

namespace App\Listeners;

use App\Events\DocumentOpened;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;

class OpenDocumentWindow
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DocumentOpened $event): void
    {
        /** @var \Native\Laravel\Windows\WindowManager $window */
        $window = Window::getFacadeRoot();
        $path = Dialog::new()
            ->title('Open Sketch Book')
            ->asSheet()
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
