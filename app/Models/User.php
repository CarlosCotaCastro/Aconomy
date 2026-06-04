<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image_path',
        'email_on_message',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'email_on_message' => 'boolean',
        ];
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class)->withPivot('approved')->withTimestamps();
    }

    public function approvedGroups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class)
            ->wherePivot('approved', true)
            ->withTimestamps();
    }

    public function lendingsAsLender()
    {
        return $this->hasMany(Lending::class, 'lender_id');
    }

    public function lendingsAsBorrower()
    {
        return $this->hasMany(Lending::class, 'borrower_id');
    }

    public function borrowRequests()
    {
        return $this->hasMany(BorrowRequest::class, 'borrower_id');
    }

    public function lendRequests()
    {
        return $this->hasMany(BorrowRequest::class, 'lender_id');
    }

    /**
     * Conversations where this user is the lower-id participant.
     */
    public function conversationsAsOne(): HasMany
    {
        return $this->hasMany(Conversation::class, 'user_one_id');
    }

    /**
     * Conversations where this user is the higher-id participant.
     */
    public function conversationsAsTwo(): HasMany
    {
        return $this->hasMany(Conversation::class, 'user_two_id');
    }

    /**
     * Messages sent by this user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
