<?php

namespace Tests\Unit\Window\Domain\Handler;

use Native\Laravel\Facades\Window;
use OpenSketch\Window\Domain\Command\OpenWindowCommand;
use OpenSketch\Window\Domain\Handler\OpenWindow;
use OpenSketch\Window\Domain\WindowProvider;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class OpenWindowTest extends TestCase
{
    public function testOpensRequestedWindow(): void
    {
        $windowProvider = $this->createMock(WindowProvider::class);
        $windowProvider->expects($this->once())
            ->method('open');

        $openWindow = new OpenWindow($windowProvider);

        $openWindow->handle(
            new OpenWindowCommand(
                Uuid::uuid4()->toString(),
                'new-window',
                '/path/to/file.json',
                'sketch-book',
            )
        );
    }
}
