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
