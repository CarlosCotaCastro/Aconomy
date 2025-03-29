<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $groups = Group::with('users')->get();
        return Inertia::render('Groups/Index', ['groups' => $groups]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Groups/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group = Group::create($validated);
        $group->users()->attach(auth()->id(), ['approved' => true]);

        return redirect()->route('groups.index')->with('message', 'Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        $group->load(['users' => function($query) {
            $query->select('users.id', 'users.name', 'users.email', 'group_user.approved');
        }]);
        
        return Inertia::render('Groups/Show', [
            'group' => $group,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        return Inertia::render('Groups/Edit', ['group' => $group->load('users')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('groups.index')->with('message', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group->delete();

        return redirect()->route('groups.index')->with('message', 'Group deleted successfully.');
    }

    /**
     * Approve a user's request to join the group.
     */
    public function approve(Group $group, User $user)
    {
        // Check if the authenticated user is an approved member of the group
        $this->authorize('approveMembers', $group);
        
        $group->users()->updateExistingPivot($user->id, ['approved' => true]);
        
        return redirect()->back()->with('success', 'User approved successfully.');
    }

    /**
     * Search for items in a group.
     */
    public function searchItems(Request $request, Group $group)
    {
        $searchQuery = $request->input('query', '');
        
        \Log::info('Search request received', [
            'group_id' => $group->id,
            'query' => $searchQuery,
            'user_id' => Auth::id()
        ]);
        
        // Check if the user is an approved member of the group
        $isUserApproved = $group->users()->where('user_id', Auth::id())->where('approved', true)->exists();
        
        \Log::info('User approval status', [
            'isUserApproved' => $isUserApproved
        ]);
        
        if (!$isUserApproved) {
            \Log::warning('Unauthorized search attempt', [
                'user_id' => Auth::id(),
                'group_id' => $group->id
            ]);
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Verify that the group exists
        \Log::info('Group details', [
            'group_id' => $group->id,
            'group_name' => $group->name,
            'member_count' => $group->users()->count()
        ]);
        
        // Check database state before search
        $dbItemCount = \App\Models\Item::where('group_id', $group->id)->count();
        \Log::info('Database items', [
            'group_id' => $group->id,
            'item_count' => $dbItemCount,
        ]);
        
        try {
            // Search for items in the group using Meilisearch
            if ($searchQuery) {
                $items = \App\Models\Item::search($searchQuery, function ($meilisearch, $query, $options) use ($group) {
                    // Add filter for group_id
                    $options['filter'] = 'group_id = ' . $group->id;
                    return $meilisearch->search($query, $options);
                })->get();
                
                \Log::info('Search results with query', [
                    'query' => $searchQuery,
                    'filter' => 'group_id = ' . $group->id,
                    'result_count' => $items->count()
                ]);
            } else {
                // If no search query, return all items in the group from database
                $items = \App\Models\Item::where('group_id', $group->id)->get();
                
                \Log::info('All items (no query)', [
                    'result_count' => $items->count()
                ]);
            }
            
            // Load necessary relationships
            $items->load('user');
            
            // Add availability status to each item
            $items->each(function($item) {
                $item->is_available = $item->isAvailable();
            });
            
            return response()->json($items);
        } catch (\Exception $e) {
            \Log::error('Search error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Fallback to database query if Meilisearch fails
            $items = \App\Models\Item::where('group_id', $group->id)->get();
            $items->load('user');
            $items->each(function($item) {
                $item->is_available = $item->isAvailable();
            });
            
            \Log::info('Fallback to database query', [
                'result_count' => $items->count()
            ]);
            
            return response()->json($items);
        }
    }
}
