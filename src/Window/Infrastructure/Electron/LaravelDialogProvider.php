<?php

declare(strict_types=1);

namespace OpenSketch\Window\Infrastructure\Electron;

use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;
use OpenSketch\Window\Domain\DialogProvider;

final class LaravelDialogProvider implements DialogProvider
{
    public function __construct(
        private readonly Dialog $dialog
    ) {
    }

    public function open(): string
    {
        $storagePath = Storage::disk('user_documents')->path('OpenSketch');
        $path = $this->dialog
            ->title(__('open_sketch_book'))
            ->asSheet(Window::current()->id ?? 'welcome')
            ->defaultPath($storagePath)
            ->open();

        return str_replace(
            storage_path('app'),
            '',
            $path ?? ''
        );
    }

    public function save(string $title, string $path): ?string
    {
        $storagePath = Storage::disk('user_documents')->path($path);

        return $this->dialog
            ->title(__($title))
            ->asSheet(
                Window::current()->id ?? 'welcome'
            )
            ->defaultPath($storagePath)
            ->save();
    }
}
