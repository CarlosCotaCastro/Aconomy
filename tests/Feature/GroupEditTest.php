<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupEditTest extends TestCase
{
    use RefreshDatabase;

    public function test_group_creator_can_see_edit_link()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the user as the first approved member (creator)
        $group->users()->attach($user->id, ['approved' => true]);

        $response = $this->actingAs($user)
            ->get(route('groups.show', $group));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('isGroupCreator', true)
        );
    }

    public function test_non_creator_cannot_see_edit_link()
    {
        $creator = User::factory()->create();
        $otherUser = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the creator as the first approved member
        $group->users()->attach($creator->id, ['approved' => true]);
        // Attach the other user as a member
        $group->users()->attach($otherUser->id, ['approved' => true]);

        $response = $this->actingAs($otherUser)
            ->get(route('groups.show', $group));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('isGroupCreator', false)
        );
    }

    public function test_group_creator_can_access_edit_page()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the user as the first approved member (creator)
        $group->users()->attach($user->id, ['approved' => true]);

        $response = $this->actingAs($user)
            ->get(route('groups.edit', $group));

        $response->assertStatus(200);
    }

    public function test_non_creator_cannot_access_edit_page()
    {
        $creator = User::factory()->create();
        $otherUser = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the creator as the first approved member
        $group->users()->attach($creator->id, ['approved' => true]);
        // Attach the other user as a member
        $group->users()->attach($otherUser->id, ['approved' => true]);

        $response = $this->actingAs($otherUser)
            ->get(route('groups.edit', $group));

        $response->assertStatus(403);
    }

    public function test_group_creator_can_update_group()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create(['name' => 'Original Name']);

        // Attach the user as the first approved member (creator)
        $group->users()->attach($user->id, ['approved' => true]);

        $response = $this->actingAs($user)
            ->put(route('groups.update', $group), [
                'name' => 'Updated Name',
                'description' => 'Updated description',
            ]);

        $response->assertRedirect(route('groups.show', $group));

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);
    }

    public function test_non_creator_cannot_update_group()
    {
        $creator = User::factory()->create();
        $otherUser = User::factory()->create();
        $group = Group::factory()->create(['name' => 'Original Name']);

        // Attach the creator as the first approved member
        $group->users()->attach($creator->id, ['approved' => true]);
        // Attach the other user as a member
        $group->users()->attach($otherUser->id, ['approved' => true]);

        $response = $this->actingAs($otherUser)
            ->put(route('groups.update', $group), [
                'name' => 'Updated Name',
                'description' => 'Updated description',
            ]);

        $response->assertStatus(403);

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'name' => 'Original Name',
        ]);
    }
}
