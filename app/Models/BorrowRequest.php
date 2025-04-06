<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BorrowRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'lender_id',
        'borrower_id',
        'message',
        'status',
        'expires_at',
        'handover_code',
        'handover_code_expires_at',
        'completed_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'handover_code_expires_at' => 'datetime',
        'completed_at' => 'datetime',
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

    /**
     * Determine if the borrow request is pending
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }

    /**
     * Determine if the borrow request is approved
     */
    public function isApproved()
    {
        return $this->status === 'approved';
    }

    /**
     * Determine if the borrow request is denied
     */
    public function isDenied()
    {
        return $this->status === 'denied';
    }

    /**
     * Determine if the borrow request is completed
     */
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    /**
     * Determine if the handover code is valid
     */
    public function isHandoverCodeValid()
    {
        if (empty($this->handover_code) || empty($this->handover_code_expires_at)) {
            return false;
        }

        return now()->lt($this->handover_code_expires_at);
    }

    /**
     * Generate a new handover code
     */
    public function generateHandoverCode()
    {
        $this->handover_code = strtoupper(Str::random(6));
        $this->handover_code_expires_at = now()->addMinutes(15);
        $this->save();

        return $this->handover_code;
    }
}
