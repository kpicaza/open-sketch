<?php

namespace Tests\Unit;

use OpenSketch\SketchBook\Domain\Command\ResetSketchBookLocationCommand;
use OpenSketch\SketchBook\Domain\Handler\ResetSketchBookLocation;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class ResetSketchBookLocationTest extends TestCase
{
    public function testUpdateSketchBookLocationBeforeOpen(): void
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
                ]
            ))
        ;
        $repository->expects($this->once())
            ->method('save');

        $createNeSketchBook = new ResetSketchBookLocation(
            $repository
        );

        $newSketchBookId = $createNeSketchBook->handle(ResetSketchBookLocationCommand::withIdAndPath(
            $sketchBookId,
            '/home/fake/new-location.json',
        ));

        $this->assertNotEquals($newSketchBookId, $sketchBookId);
    }

    public function testDoNotUpdateSketchBookLocationBeforeOpenWhenExist(): void
    {
        $sketchBookId = Uuid::uuid4()->toString();
        $repository = $this->createMock(SketchBookRepository::class);
        $repository->expects($this->once())
            ->method('get')
            ->with($sketchBookId)
            ->willReturn(new SketchBook(
                $sketchBookId,
                '/home/fake/location.json',
                [
                    new Sketch(1, 'data:,')
                ]
            ))
        ;
        $repository->expects($this->once())
            ->method('save');

        $createNeSketchBook = new ResetSketchBookLocation(
            $repository
        );

        $newSketchBookId = $createNeSketchBook->handle(ResetSketchBookLocationCommand::withIdAndPath(
            $sketchBookId,
            '/home/fake/location.json',
        ));

        $this->assertSame($newSketchBookId, $sketchBookId);
    }
}
