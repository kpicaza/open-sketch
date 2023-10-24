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
use Symfony\Component\HttpFoundation\InputBag;

final class PutSketchBook
{
    public function __construct(
        private readonly SaveSketchBook $saveSketchBook
    ) {
    }

    public function handle(Request $request): Response
    {
        /** @var InputBag $jsonRequest */
        $jsonRequest = $request->json();
        $sketchBookData = $jsonRequest->all();

        $this->saveSketchBook->handle(SaveSketchBookCommand::from(
            $sketchBookData['id'],
            $sketchBookData['sketches'],
            $sketchBookData['brush'],
            $sketchBookData['palette'],
        ));

        return new Response(null, 200);
    }
}
