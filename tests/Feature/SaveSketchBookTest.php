<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SketchBookReference;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class SaveSketchBookTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
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
        ]));

        SketchBookReference::firstOrNew([
            'id' => $sketchBookId,
            'storage_path' => 'home/fake/sketch-book.json',
        ])->save();

        $response = $this->json('PUT', '/api/sketch-books', [
            'id' => $sketchBookId,
            'sketches' => $sketches
        ]);

        $response->assertStatus(200);
    }
}
