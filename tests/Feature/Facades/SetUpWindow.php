<?php

namespace Tests\Feature\Facades;

use Native\Laravel\Facades\Window;

class SetUpWindow
{
    public static function setUpWindow(\Native\Laravel\Windows\Window $mockWindow): void
    {
        $window = new \StdClass();
        $window->id = 'welcome';
        Window::shouldReceive('close')
            ->atLeast();
        Window::shouldReceive('maximize')
            ->atLeast();
        Window::shouldReceive('current')
            ->atLeast()
            ->andReturn($window);
        Window::shouldReceive('open')
            ->atLeast()
            ->andReturn($mockWindow);
    }
}
