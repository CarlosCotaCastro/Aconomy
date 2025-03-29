<?php

namespace App\Policies;

use App\Models\ReturnRequest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReturnRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReturnRequest $returnRequest): bool
    {
        $lending = $returnRequest->lending;
        return $user->id === $lending->lender_id || $user->id === $lending->borrower_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReturnRequest $returnRequest): bool
    {
        return false; // Return requests shouldn't be updated directly
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReturnRequest $returnRequest): bool
    {
        return false; // Return requests shouldn't be deleted
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReturnRequest $returnRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReturnRequest $returnRequest): bool
    {
        return false;
    }
    
    /**
     * Determine whether the user can respond to the return request.
     */
    public function respond(User $user, ReturnRequest $returnRequest): bool
    {
        $lending = $returnRequest->lending;
        return $user->id === $lending->lender_id && $returnRequest->status === 'pending';
    }
}
