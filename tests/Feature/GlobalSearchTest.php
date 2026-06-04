<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GlobalSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_requires_authentication(): void
    {
        $this->get(route('search.global'))->assertRedirect(route('login'));
    }

    public function test_search_returns_sectioned_structure(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson(route('search.global', ['q' => 'anything']))
            ->assertOk()
            ->assertJsonStructure(['query', 'items', 'groups', 'people']);
    }

    public function test_groups_are_matched_by_name(): void
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['name' => 'Camping Gear Club']);
        $group->users()->attach($user->id, ['approved' => true]);

        Group::factory()->create(['name' => 'Kitchen Tools']);

        $response = $this->actingAs($user)
            ->getJson(route('search.global', ['q' => 'Camping']))
            ->assertOk();

        $names = collect($response->json('groups'))->pluck('name');
        $this->assertContains('Camping Gear Club', $names);
        $this->assertNotContains('Kitchen Tools', $names);
    }

    public function test_people_search_is_scoped_to_shared_approved_groups(): void
    {
        $user = User::factory()->create();
        $groupMate = User::factory()->create(['name' => 'Group Mate']);
        $stranger = User::factory()->create(['name' => 'Group Mate Stranger']);

        $group = Group::factory()->create();
        $group->users()->attach($user->id, ['approved' => true]);
        $group->users()->attach($groupMate->id, ['approved' => true]);

        // stranger belongs to a different group
        $otherGroup = Group::factory()->create();
        $otherGroup->users()->attach($stranger->id, ['approved' => true]);

        $response = $this->actingAs($user)
            ->getJson(route('search.global', ['q' => 'Group Mate']))
            ->assertOk();

        $names = collect($response->json('people'))->pluck('name');
        $this->assertContains('Group Mate', $names);
        $this->assertNotContains('Group Mate Stranger', $names);
    }

    public function test_items_in_shared_groups_include_own_items(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();

        $group = Group::factory()->create();
        $group->users()->attach($user->id, ['approved' => true]);
        $group->users()->attach($owner->id, ['approved' => true]);

        $sharedItem = Item::factory()->create(['name' => 'Cordless Drill', 'user_id' => $owner->id]);
        $sharedItem->groups()->attach($group->id);

        $ownItem = Item::factory()->create(['name' => 'Cordless Drill Mine', 'user_id' => $user->id]);
        $ownItem->groups()->attach($group->id);

        $response = $this->actingAs($user)
            ->getJson(route('search.global', ['q' => 'Cordless']))
            ->assertOk();

        $items = collect($response->json('items'));
        $names = $items->pluck('name');
        $this->assertContains('Cordless Drill', $names);
        $this->assertContains('Cordless Drill Mine', $names);

        $own = $items->firstWhere('name', 'Cordless Drill Mine');
        $this->assertTrue($own['is_own']);
        $this->assertFalse($items->firstWhere('name', 'Cordless Drill')['is_own']);
    }

    public function test_people_search_excludes_unapproved_members(): void
    {
        $user = User::factory()->create();
        $pending = User::factory()->create(['name' => 'Pending Person']);

        $group = Group::factory()->create();
        $group->users()->attach($user->id, ['approved' => true]);
        $group->users()->attach($pending->id, ['approved' => false]);

        $response = $this->actingAs($user)
            ->getJson(route('search.global', ['q' => 'Pending']))
            ->assertOk();

        $names = collect($response->json('people'))->pluck('name');
        $this->assertNotContains('Pending Person', $names);
    }
}
