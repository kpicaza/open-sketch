<?php

namespace App\Providers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
