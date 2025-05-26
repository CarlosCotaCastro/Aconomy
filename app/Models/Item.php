<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class Item extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'image_path',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $this->refresh();

        if (! $this->relationLoaded('groups')) {
            $this->load('groups');
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'user' => $this->user()->value('id'),
            // Other item attributes
            'groups' => $this->groups->pluck('id')->toArray(),
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with('groups');
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

    public function groups(): belongsToMany
    {
        return $this->belongsToMany(Group::class);
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
        return ! $this->lendings()->whereNull('returned_at')->exists();
    }

    /**
     * Check if there's a pending borrow request for this item
     */
    public function hasPendingBorrowRequest()
    {
        return $this->borrowRequests()->where('status', 'pending')->exists();
    }

    /**
     * Get the user who is currently borrowing this item.
     */
    public function currentBorrower()
    {
        return $this->belongsTo(User::class, 'current_borrower_id')
            ->select(['id', 'name', 'profile_image_path'])
            ->withDefault();
    }

    public function activeLending()
    {
        return $this->hasOne(Lending::class)
            ->whereNull('returned_at')
            ->latest();
    }

    protected static function booted()
    {
        static::addGlobalScope('withCurrentBorrower', function ($query) {
            $query->addSelect(['current_borrower_id' => Lending::select('borrower_id')
                ->whereColumn('item_id', 'items.id')
                ->whereNull('returned_at')
                ->latest()
                ->limit(1)
            ]);
        });
    }
}
