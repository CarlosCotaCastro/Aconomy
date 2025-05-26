<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lending extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'lender_id',
        'borrower_id',
        'lent_at',
        'returned_at',
    ];

    protected $casts = [
        'lent_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function lender()
    {
        return $this->belongsTo(User::class, 'lender_id');
    }

    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    public function returnRequests()
    {
        return $this->hasMany(ReturnRequest::class);
    }

    public function activeReturnRequest()
    {
        return $this->returnRequests()->where('status', 'pending')->latest()->first();
    }

    public function hasActiveReturnRequest()
    {
        return $this->returnRequests()->where('status', 'pending')->exists();
    }

    /**
     * Scope a query to only include active lendings (not returned).
     */
    public function scopeActiveLending($query)
    {
        return $query->whereNull('returned_at');
    }
}
