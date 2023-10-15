<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Dialog;
use Native\Laravel\Facades\Window;
use OpenSketch\SketchBook\Infrastructure\Http\GetSketchBook;
use OpenSketch\SketchBook\Infrastructure\Http\PutSketchBook;
use Ramsey\Uuid\Uuid;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::put('/sketch-books', [PutSketchBook::class, 'handle']);
Route::get('/sketch-books/{id}', [GetSketchBook::class, 'handle']);

Route::post('/sketch-books/open', function () {

    \App\Events\DocumentOpened::dispatch();

    return new JsonResponse([], 201);
});

Route::post('/sketch-books/save', function () {

    \App\Events\DocumentSaved::dispatch();

    return new JsonResponse([], 201);
});

Route::post('/sketch-books/{id}/exports/{sketchId}', function (string $id, string $sketchId) {

    /** @var \OpenSketch\SketchBook\Domain\SketchBookRepository $repository */
    $repository =  app()->get(\OpenSketch\SketchBook\Domain\SketchBookRepository::class);
    $sketchBook = $repository->get($id);

    $storagePath = Storage::disk('user_documents')
        ->path(sprintf('%s-%s.png', $sketchBook->name(), $sketchId));

    $storagePath = Dialog::new()
        ->title('Export Sketch')
        ->defaultPath($storagePath)
        ->save();

    if (empty($storagePath)) {
        return new JsonResponse([], 200);
    }


    list($type, $data) = explode(';', $sketchBook->sketches()[$sketchId - 1]->image);
    list(, $data)      = explode(',', $data);
    Storage::put($storagePath, base64_decode($data));

    return new JsonResponse([], 200);
});
