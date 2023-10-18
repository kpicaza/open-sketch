<?php

namespace Feature;

use App\Models\SketchBookReference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class ExportSketchTest extends TestCase
{
    use RefreshDatabase;

    public function testTheApplicationReturnsASuccessfulResponse(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        Storage::fake('local');
        $sketchBookId = Uuid::uuid4()->toString();
        Storage::fake()->put('/test.json', json_encode([
            'id' => $sketchBookId,
            'storage_path' => '/test.json',
            'sketches' => [
                [
                    'id' => 1,
                    'image' => 'data:,'
                ]
            ],
            'background' => '#ffffff'
        ], JSON_THROW_ON_ERROR));
        SketchBookReference::firstOrNew([
            'id' => $sketchBookId,
            'storage_path' => '/test.json',
        ])->save();

        $sketchId = 1;

        $response = $this->json(
            'POST',
            '/api/sketch-books/' . $sketchBookId . '/exports/' . $sketchId
        );

        $response->assertStatus(200);
    }
}
