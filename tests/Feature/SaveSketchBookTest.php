<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SketchBookReference;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Client\Client;
use Native\Laravel\Dialog;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class SaveSketchBookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function testTheApplicationReturnsASuccessfulResponse(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake();

        $sketchBookId = Uuid::uuid4()->toString();
        $sketches = [
            [
                'id' => 1,
                'image' => 'data:,'
            ]
        ];

        Storage::put('/home/fake/sketch-book.json', json_encode([
            'id' => $sketchBookId,
            'storage_path' => '/home/fake/sketch-book.json',
            'sketches' => $sketches
        ], JSON_THROW_ON_ERROR));

        SketchBookReference::firstOrNew([
            'id' => $sketchBookId,
            'storage_path' => '/home/fake/sketch-book.json',
        ])->save();

        $dialog = $this->getFakeDialog();
        $this->app->bind(Dialog::class, fn() => $dialog);
        $response = $this->json('PUT', '/api/sketch-books', [
            'id' => $sketchBookId,
            'sketches' => $sketches
        ]);

        $response->assertStatus(200);
    }

    public function getFakeDialog(): Dialog
    {
        return new class (new Client()) extends Dialog {
            public function open(): string
            {
                return '/home/fake/sketch-book.json';
            }
        };
    }
}
