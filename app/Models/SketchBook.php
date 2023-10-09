<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SketchBook extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;
    protected $table = 'sketch_books';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
    ];
    protected $casts = [
        'sketches' => AsArrayObject::class,
    ];

}
