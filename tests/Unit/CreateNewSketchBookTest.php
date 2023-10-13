<?php

namespace Tests\Unit;

use OpenSketch\SketchBook\Domain\Command\CreateNewSketchBookCommand;
use OpenSketch\SketchBook\Domain\Handler\CreateNewSketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class CreateNewSketchBookTest extends TestCase
{
    public function testItCreatesAndSavesNewSketchBookInTheFileSystem(): void
    {
        $repository = $this->createMock(SketchBookRepository::class);
        $repository->expects($this->once())
            ->method('save');
        $createNeSketchBook = new CreateNewSketchBook(
            $repository
        );

        $createNeSketchBook->handle(CreateNewSketchBookCommand::withIdAndPath(
            Uuid::uuid4(),
            '/home/kpicaza/OpenSketch'
        ));
    }
}
