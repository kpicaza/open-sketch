<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Native\Laravel\Client\Client;
use Native\Laravel\Dialog;
use Native\Laravel\Windows\Window;
use Tests\Feature\Facades\SetUpWindow;
use Tests\TestCase;

class CreateNewSketchBookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function testTheApplicationReturnsASuccessfulResponse(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        SetUpWindow::setUpWindow($this->createMock(Window::class));

        $dialog = $this->getFakeDialog();
        $this->app->bind(Dialog::class, fn() => $dialog);
        $response = $this->post('/api/sketch-books/save');

        $response->assertStatus(201);
    }

    public function testTheApplicationReturnsASuccessfulResponseCancellingDialog(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake('user_documents');
        SetUpWindow::setUpWindow($this->createMock(Window::class));

        $response = $this->post('/api/sketch-books/save');

        $response->assertStatus(201);
    }

    public function getFakeDialog(): Dialog
    {
        return new class (new Client()) extends Dialog {
            public function save(): string
            {
                Storage::fake()->put('/test.json', '');

                return '/home/fake/sketch-book.json';
            }
        };
    }
}
