<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pheature_toggles', function (Blueprint $table) {
            $table->string('feature_id');
            $table->primary('feature_id');
            $table->string('name');
            $table->boolean('enabled');
            $table->json('strategies');
            $table->dateTime('created_at');
            $table->dateTime('updated_at')->nullable();
        });

        DB::insert(
            <<<SQL
                INSERT INTO `pheature_toggles` (
                    feature_id, name, enabled, strategies, created_at
                ) VALUES (
                   :feature_id, :name, :enabled, :strategies, :created_at
                )
            SQL,
            [
                'feature_id' => 'export-sketch-as-png',
                'name' => 'Export Sketch As PNG',
                'enabled' => 0,
                'strategies' => '[]',
                'created_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s')

            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pheature_toggles');
    }
};
