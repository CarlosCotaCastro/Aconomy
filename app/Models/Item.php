<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Item extends Model
{
    use HasFactory, Searchable;
    
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'group_id',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'group_id' => (int) $this->group_id,
            'user_id' => (int) $this->user_id,
            'created_at' => $this->created_at?->timestamp ?? null,
            'updated_at' => $this->updated_at?->timestamp ?? null,
        ];
    }

    /**
     * Define which Scout engine this model uses
     */
    public function searchableUsing()
    {
        return app(\Laravel\Scout\EngineManager::class)->engine();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function lendings()
    {
        return $this->hasMany(Lending::class);
    }

    public function borrowRequests()
    {
        return $this->hasMany(BorrowRequest::class);
    }

    public function isAvailable()
    {
        return !$this->lendings()->whereNull('returned_at')->exists();
    }

    /**
     * Check if there's a pending borrow request for this item
     */
    public function hasPendingBorrowRequest()
    {
        return $this->borrowRequests()->where('status', 'pending')->exists();
    }
}
