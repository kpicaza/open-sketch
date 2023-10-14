<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SketchBookReference extends Model
{
    use HasFactory;
    use HasUuids;

    public $timestamps = false;
    protected $table = 'sketch_books_reference';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'storage_path'
    ];
}
