<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_member_can_view_member_list(): void
    {
        $member = User::factory()->create(['name' => 'Visible Member', 'email' => 'member@example.com']);
        $otherMember = User::factory()->create(['name' => 'Other Member', 'email' => 'other@example.com']);
        $group = Group::factory()->create();

        $group->users()->attach($member->id, ['approved' => true]);
        $group->users()->attach($otherMember->id, ['approved' => true]);

        $response = $this->actingAs($member)
            ->get(route('groups.show', $group));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('canViewMembers', true)
            ->where('approvedMembersCount', 2)
            ->has('group.users', 2)
            ->where('group.users.0.email', 'member@example.com')
            ->where('group.users.1.email', 'other@example.com')
        );
    }

    public function test_non_member_cannot_view_member_details(): void
    {
        $member = User::factory()->create(['name' => 'Hidden Member', 'email' => 'hidden@example.com']);
        $visitor = User::factory()->create();
        $group = Group::factory()->create();

        $group->users()->attach($member->id, ['approved' => true]);

        $response = $this->actingAs($visitor)
            ->get(route('groups.show', $group));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('canViewMembers', false)
            ->where('approvedMembersCount', 1)
            ->has('group.users', 0)
        );
    }

    public function test_pending_member_cannot_view_member_details(): void
    {
        $member = User::factory()->create(['email' => 'hidden@example.com']);
        $pendingUser = User::factory()->create(['email' => 'pending@example.com']);
        $group = Group::factory()->create();

        $group->users()->attach($member->id, ['approved' => true]);
        $group->users()->attach($pendingUser->id, ['approved' => false]);

        $response = $this->actingAs($pendingUser)
            ->get(route('groups.show', $group));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('canViewMembers', false)
            ->where('approvedMembersCount', 1)
            ->has('group.users', 1)
            ->where('group.users.0.email', 'pending@example.com')
        );
    }
}
