<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class Group extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'description',
        'banner_image_path',
        'avatar_image_path',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('approved')->withTimestamps();
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class);
    }
}
