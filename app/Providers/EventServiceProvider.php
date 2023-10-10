<?php

namespace App\Providers;

use App\Events\DocumentOpened;
use App\Events\DocumentSaved;
use App\Listeners\OpenDocumentWindow;
use App\Listeners\StoreDocument;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Native\Laravel\Events\App\OpenFile;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        DocumentSaved::class => [
            StoreDocument::class,
        ],
        DocumentOpened::class => [
            OpenDocumentWindow::class,
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
