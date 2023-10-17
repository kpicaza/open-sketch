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
                    ->submenu(__('file'), Menu::new()
                        ->event(DocumentOpened::class, __('open_sketch_book'))
                        ->event(DocumentSaved::class, __('save_sketch_book')))
                    ->separator()
                    ->link('https://github.com/kpicaza/open-sketch', __('learn_more'))
                    ->link('https://github.com/sponsors/kpicaza', __('contribute'))
                    ->separator()
                    ->quit()
            )
            ->icon(storage_path('app/images/logo.png'));

        Menu::new()
            ->submenu('Open Sketch', Menu::new()
                ->link('https://nativephp.com', __('documentation')))
            ->submenu(__('file'), Menu::new()
                ->event(DocumentOpened::class, __('open_sketch_book'))
                ->event(DocumentSaved::class, __('save_sketch_book')))
            ->windowMenu()
            ->register();

        /** @var WindowManager $window */
        $window = Window::getFacadeRoot();

        $window->open('welcome')
            ->hideMenu(false);
        $window->resize(800, 600, 'welcome');
    }

    /**
     * @return array<string, string>
     */
    public function phpIni(): array
    {
        return [
        ];
    }
}
