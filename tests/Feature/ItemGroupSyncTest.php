<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Item;
use App\Models\User;
use App\Services\ItemGroupSyncService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemGroupSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_approving_member_attaches_their_items_to_the_group(): void
    {
        $approver = User::factory()->create();
        $owner = User::factory()->create();
        $searcher = User::factory()->create();

        $groupA = Group::factory()->create(['name' => 'Group A']);
        $groupB = Group::factory()->create(['name' => 'Group B']);

        $groupA->users()->attach($owner->id, ['approved' => true]);
        $groupB->users()->attach($approver->id, ['approved' => true]);
        $groupB->users()->attach($searcher->id, ['approved' => true]);
        $groupB->users()->attach($owner->id, ['approved' => false]);

        $item = Item::factory()->create([
            'name' => 'Shared Drill',
            'user_id' => $owner->id,
        ]);
        $item->groups()->attach($groupA->id);

        $this->actingAs($approver)
            ->post(route('groups.approve', [$groupB, $owner]))
            ->assertRedirect();

        $groupIds = $item->fresh()->groups()->pluck('groups.id')->all();
        $this->assertContains($groupA->id, $groupIds);
        $this->assertContains($groupB->id, $groupIds);

        $response = $this->actingAs($searcher)
            ->getJson(route('search.global', ['q' => 'Shared']))
            ->assertOk();

        $names = collect($response->json('items'))->pluck('name');
        $this->assertContains('Shared Drill', $names);
    }

    public function test_new_item_is_attached_to_all_approved_groups(): void
    {
        $user = User::factory()->create();
        $groupA = Group::factory()->create();
        $groupB = Group::factory()->create();

        $groupA->users()->attach($user->id, ['approved' => true]);
        $groupB->users()->attach($user->id, ['approved' => true]);

        $this->actingAs($user)
            ->post(route('items.store'), [
                'name' => 'Multi Group Lamp',
                'description' => 'Lights up every group',
            ])
            ->assertRedirect(route('items.index'));

        $item = Item::where('name', 'Multi Group Lamp')->first();
        $this->assertNotNull($item);

        $groupIds = $item->groups()->pluck('groups.id')->sort()->values()->all();
        $this->assertEquals(collect([$groupA->id, $groupB->id])->sort()->values()->all(), $groupIds);
    }

    public function test_leaving_group_detaches_user_items_from_that_group(): void
    {
        $user = User::factory()->create();
        $groupA = Group::factory()->create();
        $groupB = Group::factory()->create();

        $groupA->users()->attach($user->id, ['approved' => true]);
        $groupB->users()->attach($user->id, ['approved' => true]);

        $item = Item::factory()->create(['user_id' => $user->id]);
        $item->groups()->attach([$groupA->id, $groupB->id]);

        $this->actingAs($user)
            ->delete(route('groups.leave', $groupA))
            ->assertRedirect(route('groups.index'));

        $groupIds = $item->fresh()->groups()->pluck('groups.id')->all();
        $this->assertNotContains($groupA->id, $groupIds);
        $this->assertContains($groupB->id, $groupIds);
    }

    public function test_search_rebuild_backfills_missing_group_links(): void
    {
        $user = User::factory()->create();
        $groupA = Group::factory()->create();
        $groupB = Group::factory()->create();

        $groupA->users()->attach($user->id, ['approved' => true]);
        $groupB->users()->attach($user->id, ['approved' => true]);

        $item = Item::factory()->create(['user_id' => $user->id]);
        $item->groups()->attach($groupA->id);

        $this->assertDatabaseMissing('group_item', [
            'group_id' => $groupB->id,
            'item_id' => $item->id,
        ]);

        $this->artisan('search:rebuild', ['--skip-backfill' => false])
            ->assertSuccessful();

        $this->assertDatabaseHas('group_item', [
            'group_id' => $groupB->id,
            'item_id' => $item->id,
        ]);
    }

    public function test_sync_user_items_to_approved_groups_replaces_stale_links(): void
    {
        $user = User::factory()->create();
        $groupA = Group::factory()->create();
        $groupB = Group::factory()->create();
        $staleGroup = Group::factory()->create();

        $groupA->users()->attach($user->id, ['approved' => true]);
        $groupB->users()->attach($user->id, ['approved' => true]);

        $item = Item::factory()->create(['user_id' => $user->id]);
        $item->groups()->attach([$groupA->id, $staleGroup->id]);

        app(ItemGroupSyncService::class)->syncUserItemsToApprovedGroups($user);

        $groupIds = $item->fresh()->groups()->pluck('groups.id')->sort()->values()->all();
        $this->assertEquals(collect([$groupA->id, $groupB->id])->sort()->values()->all(), $groupIds);
        $this->assertNotContains($staleGroup->id, $groupIds);
    }

    public function test_creating_group_attaches_creator_items_to_new_group(): void
    {
        $user = User::factory()->create();
        $existingGroup = Group::factory()->create();
        $existingGroup->users()->attach($user->id, ['approved' => true]);

        $item = Item::factory()->create(['user_id' => $user->id]);
        $item->groups()->attach($existingGroup->id);

        $this->actingAs($user)
            ->post(route('groups.store'), [
                'name' => 'Brand New Group',
                'description' => 'Fresh group',
            ])
            ->assertRedirect(route('groups.index'));

        $newGroup = Group::where('name', 'Brand New Group')->first();
        $this->assertNotNull($newGroup);

        $groupIds = $item->fresh()->groups()->pluck('groups.id')->all();
        $this->assertContains($existingGroup->id, $groupIds);
        $this->assertContains($newGroup->id, $groupIds);
    }
}
