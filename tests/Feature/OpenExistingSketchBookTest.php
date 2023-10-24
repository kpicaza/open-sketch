<?php

namespace Tests\Feature;

use App\Models\SketchBookReference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Client\Client;
use Native\Laravel\Dialog;
use Native\Laravel\Windows\Window;
use Ramsey\Uuid\Uuid;
use Tests\Feature\Facades\SetUpWindow;
use Tests\TestCase;

class OpenExistingSketchBookTest extends TestCase
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
        SetUpWindow::setUpWindow($this->createMock(Window::class));

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
            'storage_path' => '/test.json',
        ])->save();

        $dialog = $this->getFakeDialog();
        $this->app->bind(Dialog::class, fn() => $dialog);
        $response = $this->post('/api/sketch-books/open');

        $response->assertStatus(201);
    }

    public function testTheApplicationReturnsASuccessfulResponseWithMissingReference(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        Storage::fake('local');
        SetUpWindow::setUpWindow($this->createMock(Window::class));

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

        $dialog = $this->getFakeDialog();
        $this->app->bind(Dialog::class, fn() => $dialog);
        $response = $this->post('/api/sketch-books/open');

        $response->assertStatus(201);
    }

    public function testTheApplicationReturnsASuccessfulResponseCancellingDialog(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        SetUpWindow::setUpWindow($this->createMock(Window::class));

        $response = $this->post('/api/sketch-books/open');

        $response->assertStatus(201);
    }

    public function getFakeDialog(): Dialog
    {
        return new class (new Client()) extends Dialog {
            public function open(): string
            {
                return '/test.json';
            }
        };
    }
}
