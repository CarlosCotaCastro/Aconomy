<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update the user's profile image.
     */
    public function updateImage(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old image if it exists
        if ($user->profile_image_path) {
            Storage::disk('public')->delete($user->profile_image_path);
        }

        // Store new image
        $path = $request->file('image')->store('profile-images', 'public');
        $user->profile_image_path = $path;
        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Display the specified user's profile.
     */
    public function show(User $user)
    {
        // Load the user's items and their current status
        $user->load(['items' => function ($query) {
            $query->with([
                'currentBorrower:id,name,profile_image_path',
                'activeLending:id,item_id,borrower_id,lender_id,created_at,returned_at',
            ])
                ->latest()
                ->take(12);
        }]);

        // Get items the user is currently borrowing through active lendings
        $borrowedItems = \App\Models\Lending::query()
            ->select([
                'lendings.id as lending_id',
                'lendings.item_id',
                'lendings.borrower_id',
                'lendings.lender_id',
                'lendings.created_at',
                'lendings.returned_at',
            ])
            ->where('lendings.borrower_id', $user->id)
            ->whereNull('lendings.returned_at')
            ->with(['item' => function ($query) {
                $query->with(['user:id,name,profile_image_path']);
            }])
            ->latest()
            ->take(12)
            ->get()
            ->pluck('item')
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'image_path' => $item->image_path,
                    'user' => $item->user->only(['id', 'name', 'profile_image_path']),
                ];
            });

        return Inertia::render('Profile/Show', [
            'profileUser' => $user->only(['id', 'name', 'email', 'profile_image_path', 'created_at']),
            'items' => $user->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'image_path' => $item->image_path,
                    'is_available' => $item->isAvailable(),
                    'current_borrower' => $item->currentBorrower ? [
                        'id' => $item->currentBorrower->id,
                        'name' => $item->currentBorrower->name,
                        'profile_image_path' => $item->currentBorrower->profile_image_path,
                    ] : null,
                    'active_lending' => $item->activeLending ? [
                        'id' => $item->activeLending->id,
                        'item_id' => $item->activeLending->item_id,
                        'borrower_id' => $item->activeLending->borrower_id,
                        'lender_id' => $item->activeLending->lender_id,
                        'created_at' => $item->activeLending->created_at,
                        'returned_at' => $item->activeLending->returned_at,
                    ] : null,
                    'user' => $item->user->only(['id', 'name', 'profile_image_path']),
                ];
            }),
            'borrowedItems' => $borrowedItems,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
