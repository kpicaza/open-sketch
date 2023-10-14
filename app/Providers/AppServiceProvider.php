<?php

namespace App\Providers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use League\Flysystem\InMemory\InMemoryFilesystemAdapter;
use Native\Laravel\Dialog;
use OpenSketch\SketchBook\Domain\Handler\SaveSketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use OpenSketch\SketchBook\Infrastructure\Http\GetSketchBook;
use OpenSketch\SketchBook\Infrastructure\Http\PutSketchBook;
use OpenSketch\SketchBook\Infrastructure\Persistence\EloquentSketchBookRepository;
use OpenSketch\SketchBook\Infrastructure\Persistence\FileSystemSketchBookRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            SketchBookRepository::class,
            FileSystemSketchBookRepository::class
        );

        $this->app->bind(PutSketchBook::class);
        $this->app->bind(GetSketchBook::class);
        $this->app->bind(Dialog::class, fn() => Dialog::new());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
