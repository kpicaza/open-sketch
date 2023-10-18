<?php

namespace Tests\Unit\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Handler\SaveSketchBook;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class SaveSketchBookTest extends TestCase
{
    public function testSaveSketchBook(): void
    {
        $sketchBookId = Uuid::uuid4()->toString();
        $repository = $this->createMock(SketchBookRepository::class);
        $repository->expects($this->once())
            ->method('get')
            ->with($sketchBookId)
            ->willReturn(new SketchBook(
                $sketchBookId,
                '/home/fake/old-location.json',
                [
                    new Sketch(1, 'data:,')
                ],
                '#000000'
            ))
        ;
        $repository->expects($this->once())
            ->method('save')
            ->with(new SketchBook(
                $sketchBookId,
                '/home/fake/old-location.json',
                [
                    new Sketch(1, 'data:1'),
                    new Sketch(2, 'data:2'),
                    new Sketch(3, 'data:3'),
                ],
                '#ffffff'
            ));

        $createNeSketchBook = new SaveSketchBook(
            $repository
        );

        $createNeSketchBook->handle(SaveSketchBookCommand::from(
            $sketchBookId,
            [
                ['id' => '1', 'image' => 'data:1'],
                ['id' => '2', 'image' => 'data:2'],
                ['id' => '3', 'image' => 'data:3'],
            ],
            '#ffffff'
        ));
    }
}
