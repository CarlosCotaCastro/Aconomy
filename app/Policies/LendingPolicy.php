<?php

namespace App\Policies;

use App\Models\Lending;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LendingPolicy
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
    public function view(User $user, Lending $lending): bool
    {
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
    public function update(User $user, Lending $lending): bool
    {
        return $user->id === $lending->lender_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Lending $lending): bool
    {
        return $user->id === $lending->lender_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Lending $lending): bool
    {
        return $user->id === $lending->lender_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Lending $lending): bool
    {
        return $user->id === $lending->lender_id;
    }

    /**
     * Determine whether the user can mark the lending as returned.
     */
    public function return(User $user, Lending $lending): bool
    {
        return $user->id === $lending->lender_id && $lending->returned_at === null;
    }
    
    /**
     * Determine whether the user can create a return request.
     */
    public function createReturnRequest(User $user, Lending $lending): bool
    {
        return $user->id === $lending->borrower_id && $lending->returned_at === null;
    }
}
