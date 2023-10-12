<?php

namespace App\Providers;

use App\Events\DocumentOpened;
use App\Events\DocumentSaved;
use Native\Laravel\Facades\MenuBar;
use Native\Laravel\Facades\Window;
use Native\Laravel\Contracts\ProvidesPhpIni;
use Native\Laravel\Menu\Menu;
use Native\Laravel\Windows\WindowManager;

class NativeAppServiceProvider implements ProvidesPhpIni
{
    /**
     * Executed once the native application has been booted.
     * Use this method to open windows, register global shortcuts, etc.
     */
    public function boot(): void
    {
        MenuBar::create()
            ->showDockIcon()
            ->onlyShowContextMenu()
            ->withContextMenu(
                Menu::new()
                    ->label('Open Sketch')
                    ->submenu('File', Menu::new()
                        ->event(DocumentOpened::class, 'Open Recent')
                        ->event(DocumentSaved::class, 'New Sketch Book')
                    )
                    ->separator()
                    ->link('https://github.com/kpicaza/open-sketch', 'Learn more…')
                    ->link('https://github.com/sponsors/kpicaza', 'Contribute')
                    ->separator()
                    ->quit()
            )
            ->icon(storage_path('app/images/logo.png'));

        Menu::new()
            ->submenu('Open Sketch', Menu::new()
                ->link('https://nativephp.com', 'Documentation')
            )
            ->submenu('File', Menu::new()
                ->event(\App\Events\DocumentOpened::class, 'Open Recent')
                ->event(DocumentSaved::class, 'New Sketch Book')
            )
            ->windowMenu()
            ->register();

        /** @var WindowManager $window */
        $window = Window::getFacadeRoot();

        $window->open('welcome')
            ->hideMenu(false);
        $window->resize(800, 600, 'welcome');
    }

    /**
     * Return an array of php.ini directives to be set.
     */
    public function phpIni(): array
    {
        return [
        ];
    }
}
