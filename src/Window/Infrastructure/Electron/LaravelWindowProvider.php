<?php

declare(strict_types=1);

namespace OpenSketch\Window\Infrastructure\Electron;

use Native\Laravel\Facades\Window;
use OpenSketch\Window\Domain\Command\OpenWindowCommand;
use OpenSketch\Window\Domain\WindowProvider;

final class LaravelWindowProvider implements WindowProvider
{
    public function open(OpenWindowCommand $command): void
    {
        /** @var \Native\Laravel\Windows\WindowManager $window */
        $window = Window::getFacadeRoot();
        Window::open('welcome');
        /** @phpstan-ignore-next-line */
        Window::close(Window::current()->id === 'welcome'
            ? 'sketch-book'
            : Window::current()->id);
        Window::open($command->openingWindowName)
            ->title(sprintf('Sketch Book: %s', $command->fileName()))
            ->route($command->routeName, [
                'id' => $command->sketchBookId,
            ])
        ;
        $window->maximize($command->openingWindowName);

        Window::close('welcome');
    }
}
