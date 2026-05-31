<?php

namespace App\Http\Controllers;

use App\Models\BorrowRequest;
use App\Models\Group;
use App\Models\Item;
use App\Models\Lending;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Dashboard', [
            'items' => Item::where('user_id', $user->id)
                ->with(['lendings' => function ($query) {
                    $query->whereNull('returned_at');
                }])
                ->select('id', 'name', 'description', 'image_path')
                ->get(),
            'groups' => Group::whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
                ->with(['users' => function ($query) {
                    $query->select('users.id', 'users.name', 'users.profile_image_path', 'group_user.approved');
                }])
                ->get(),
            'lendings' => Lending::where('lender_id', $user->id)
                ->with(['item', 'borrower'])
                ->get(),
            'borrowings' => Lending::where('borrower_id', $user->id)
                ->with(['item', 'lender'])
                ->get(),
            'incomingRequests' => BorrowRequest::where('lender_id', $user->id)
                ->where('status', 'pending')
                ->with(['item', 'borrower'])
                ->latest()
                ->get(),
            'recentActivity' => $user->notifications()
                ->latest()
                ->take(6)
                ->get()
                ->map(fn ($notification) => [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->toIso8601String(),
                ]),
        ]);
    }
}
