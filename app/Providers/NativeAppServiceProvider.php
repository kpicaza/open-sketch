<?php

namespace App\Providers;

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
        /** @var WindowManager $window */
        $window = Window::getFacadeRoot();
        $window->open()
            ->hideMenu(false);
        $window->maximize('main');
        MenuBar::create()
            ->showDockIcon()
            ->onlyShowContextMenu()
            ->withContextMenu(
                Menu::new()
                    ->label('Open Sketch')
                    ->separator()
                    ->link('https://github.com/kpicaza/open-sketch', 'Learn more…')
                    ->link('https://github.com/sponsors/kpicaza', 'Contribute')
                    ->separator()
                    ->quit()
            )
            ->icon(storage_path('app/images/logo.png'))
        ;

        Menu::new()
            ->appMenu()
            ->editMenu()
            ->viewMenu()
            ->windowMenu()
            ->register();
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
