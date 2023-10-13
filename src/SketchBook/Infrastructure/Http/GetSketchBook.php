<?php

declare(strict_types=1);

namespace OpenSketch\SketchBook\Infrastructure\Http;

use Illuminate\Http\JsonResponse;
use OpenSketch\SketchBook\Domain\SketchBookRepository;

final readonly class GetSketchBook
{
    public function __construct(
        private SketchBookRepository $sketchBookRepository
    ) {
    }

    public function handle(string $id): JsonResponse
    {
        $sketchBook = $this->sketchBookRepository->get($id);

        return new JsonResponse($sketchBook);
    }
}
