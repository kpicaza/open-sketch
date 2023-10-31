<?php

namespace Unit\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\DownloadSketchCommand;
use OpenSketch\SketchBook\Domain\Exception\CannotCreateImage;
use OpenSketch\SketchBook\Domain\Handler\DownloadSketch;
use OpenSketch\SketchBook\Domain\ImageManipulation;
use OpenSketch\SketchBook\Domain\Model\Brush;
use OpenSketch\SketchBook\Domain\Model\Palette;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;
use OpenSketch\Window\Domain\DialogProvider;
use PHPUnit\Framework\TestCase;
use Ramsey\Uuid\Uuid;

class DownloadSketchTest extends TestCase
{
    public function testDownloadsASketch(): void
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
                Brush::default(),
                Palette::default()
            ))
        ;

        $dialogProvider = $this->createMock(DialogProvider::class);
        $dialogProvider->expects($this->once())
            ->method('save')
            ->willReturn('/home/fake/old-location.json');

        $downloadSketch = new DownloadSketch(
            $repository,
            $dialogProvider,
            $this->createMock(ImageManipulation::class)
        );

        $downloadSketch->handle(
            DownloadSketchCommand::from(
                $sketchBookId,
                1
            )
        );
    }

    public function testThrowsCannotCreateImageException(): void
    {
        $this->expectException(CannotCreateImage::class);
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
                Brush::default(),
                Palette::default()
            ))
        ;

        $dialogProvider = $this->createMock(DialogProvider::class);
        $dialogProvider->expects($this->once())
            ->method('save')
            ->willReturn('//home/fake/old-location.json');

        $imageManipulation = $this->createMock(ImageManipulation::class);
        $imageManipulation->expects($this->once())
            ->method('make')
            ->willThrowException(CannotCreateImage::withMessage('Hello World! Failed'));

        $downloadSketch = new DownloadSketch($repository, $dialogProvider, $imageManipulation);

        $downloadSketch->handle(
            DownloadSketchCommand::from(
                $sketchBookId,
                1
            )
        );
    }
}
