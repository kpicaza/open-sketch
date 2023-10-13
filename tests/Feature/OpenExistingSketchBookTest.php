<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OpenExistingSketchBookTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        config()->set('nativephp-internal.api_url', 'https://jsonplaceholder.typicode.com/todos/1');
        Storage::fake();
        $response = $this->post('/api/sketch-books/open');

        $response->assertStatus(201);
    }
}
