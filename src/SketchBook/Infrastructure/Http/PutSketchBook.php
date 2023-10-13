<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Http;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenSketch\SketchBook\Domain\Command\SaveSketchBookCommand;
use OpenSketch\SketchBook\Domain\Handler\SaveSketchBook;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final readonly class PutSketchBook
{
    public function __construct(
        private SaveSketchBook $saveSketchBook
    ) {
    }

    public function handle(Request $request): Response
    {
        $sketchBookData = $request->json()->all();

        $this->saveSketchBook->handle(SaveSketchBookCommand::withIdAndSketches(
            $sketchBookData['id'],
            $sketchBookData['sketches'],
        ));

        return new Response(null, 200);
    }
}
