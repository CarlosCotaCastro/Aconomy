<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Group;
use App\Models\Lending;

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
                ->get(),
            'groups' => Group::whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->with(['users' => function ($query) {
                    $query->select('users.id', 'users.name', 'group_user.approved');
                }])
                ->get(),
            'lendings' => Lending::where('lender_id', $user->id)
                ->with(['item', 'borrower'])
                ->get(),
            'borrowings' => Lending::where('borrower_id', $user->id)
                ->with(['item', 'lender'])
                ->get(),
        ]);
    }
} 