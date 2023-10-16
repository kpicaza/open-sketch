<?php

namespace App\Providers;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Tools\DsnParser;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Native\Laravel\Dialog;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use OpenSketch\SketchBook\Infrastructure\Http\GetSketchBook;
use OpenSketch\SketchBook\Infrastructure\Http\PutSketchBook;
use OpenSketch\SketchBook\Infrastructure\Persistence\FileSystemSketchBookRepository;
use OpenSketch\Window\Domain\DialogProvider;
use OpenSketch\Window\Domain\WindowProvider;
use OpenSketch\Window\Infrastructure\Electron\LaravelDialogProvider;
use OpenSketch\Window\Infrastructure\Electron\LaravelWindowProvider;

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
        $this->app->bind(
            WindowProvider::class,
            LaravelWindowProvider::class
        );
        $this->app->bind(
            DialogProvider::class,
            LaravelDialogProvider::class
        );

        if ('test' === env('APP_ENV')) {
            return;
        }

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
