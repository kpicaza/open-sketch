<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SketchBookReference;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class GetSketchBookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function testTheApplicationReturnsASuccessfulResponse(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        Storage::fake('local');

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
            'sketches' => $sketches,
            'brush' => [
                'type' => 'pencil',
                'width' => 6,
            ],
            'palette' => [
                'primaryColor' => '#000000',
                'backgroundColor' => '#ffffff',
                'secondaryColor1' => '#00ffff',
                'secondaryColor2' => '#ff00ff',
                'secondaryColor3' => '#ffff00',
            ]
        ], JSON_THROW_ON_ERROR));

        SketchBookReference::firstOrNew([
            'id' => $sketchBookId,
            'storage_path' => 'home/fake/sketch-book.json',
        ])->save();

        $response = $this->json('GET', '/api/sketch-books/' . $sketchBookId);

        $response->assertStatus(200);
        $this->assertSame($response->json(), [
            "id" => $sketchBookId,
            "storage_path" => "home/fake/sketch-book.json",
            "sketches" => [
                0 => [
                    "id" => 1,
                    "image" => "data:,"
                ]
            ],
            'brush' => [
                'type' => 'pencil',
                'width' => 6,
            ],
            'palette' => [
                'primaryColor' => '#000000',
                'backgroundColor' => '#ffffff',
                'secondaryColor1' => '#00ffff',
                'secondaryColor2' => '#ff00ff',
                'secondaryColor3' => '#ffff00',
            ]
        ]);
    }
}
