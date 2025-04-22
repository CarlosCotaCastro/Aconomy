<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MyGroups extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Group $group)
    {

        $user = Auth::getUser();
        if (!$user instanceof User) {
            return redirect()->route('login');
        }

        return Inertia::render('Groups/MyGroups', ['groups' => $user->groups()->with('users')->get()]);
    }
}
