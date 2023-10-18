<?php

namespace Unit\SketchBook\Domain\Handler;

use OpenSketch\SketchBook\Domain\Command\DownloadSketchCommand;
use OpenSketch\SketchBook\Domain\Handler\DownloadSketch;
use OpenSketch\SketchBook\Domain\ImageManipulation;
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
                '#000000'
            ))
        ;

        $downloadSketch = new DownloadSketch(
            $repository,
            $this->createMock(DialogProvider::class),
            $this->createMock(ImageManipulation::class)
        );

        $downloadSketch->handle(
            DownloadSketchCommand::from(
                $sketchBookId,
                1
            )
        );
    }
}
