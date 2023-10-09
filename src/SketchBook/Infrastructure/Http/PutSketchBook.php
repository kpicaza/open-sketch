<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Http;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenSketch\SketchBook\Domain\Model\Sketch;
use OpenSketch\SketchBook\Domain\Model\SketchBook;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

class PutSketchBook
{
    public function __construct(
        private readonly SketchBookRepository $sketchBookRepository
    ) {
    }

    public function handle(Request $request): Response
    {
        $sketchBookData = $request->json()->all();

        $sketchBook = new SketchBook(
            $sketchBookData['id'],
            array_map(
                fn(array $sketch) => new Sketch((int)$sketch['id'], $sketch['image']),
                $sketchBookData['sketches']
            )
        );

        $this->sketchBookRepository->save($sketchBook);

        return new Response(null, 200);
    }
}
