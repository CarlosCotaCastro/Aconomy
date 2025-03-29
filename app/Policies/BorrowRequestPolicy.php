<?php

namespace App\Policies;

use App\Models\BorrowRequest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BorrowRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Any authenticated user can view their borrow requests
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BorrowRequest $borrowRequest): bool
    {
        // User can view if they are the lender or borrower
        return $user->id === $borrowRequest->lender_id || $user->id === $borrowRequest->borrower_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create borrow requests
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BorrowRequest $borrowRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BorrowRequest $borrowRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BorrowRequest $borrowRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BorrowRequest $borrowRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can respond to the borrow request.
     */
    public function respond(User $user, BorrowRequest $borrowRequest): bool
    {
        // Only the lender can approve or deny the request
        return $user->id === $borrowRequest->lender_id && $borrowRequest->isPending();
    }
    
    /**
     * Determine whether the user can verify the handover code.
     */
    public function verifyHandover(User $user, BorrowRequest $borrowRequest): bool
    {
        // Only the borrower can verify the handover code
        return $user->id === $borrowRequest->borrower_id && $borrowRequest->isApproved();
    }
}
