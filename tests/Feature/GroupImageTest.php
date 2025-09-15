<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GroupImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_group_creator_can_upload_banner_and_avatar()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the user as the first approved member (creator)
        $group->users()->attach($user->id, ['approved' => true]);

        $bannerFile = UploadedFile::fake()->image('banner.jpg', 1200, 400);
        $avatarFile = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)
            ->post(route('groups.update-images', $group), [
                'banner_image' => $bannerFile,
                'avatar_image' => $avatarFile,
            ]);

        $response->assertRedirect();

        $group->refresh();

        $this->assertNotNull($group->banner_image_path);
        $this->assertNotNull($group->avatar_image_path);
        $this->assertTrue(Storage::disk('public')->exists($group->banner_image_path));
        $this->assertTrue(Storage::disk('public')->exists($group->avatar_image_path));
    }

    public function test_group_creator_can_delete_banner_and_avatar()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create([
            'banner_image_path' => 'group-banners/test-banner.jpg',
            'avatar_image_path' => 'group-avatars/test-avatar.jpg',
        ]);

        // Attach the user as the first approved member (creator)
        $group->users()->attach($user->id, ['approved' => true]);

        // Create fake files in storage
        Storage::disk('public')->put('group-banners/test-banner.jpg', 'fake banner content');
        Storage::disk('public')->put('group-avatars/test-avatar.jpg', 'fake avatar content');

        $response = $this->actingAs($user)
            ->post(route('groups.update-images', $group), [
                'delete_banner' => true,
                'delete_avatar' => true,
            ]);

        $response->assertRedirect();

        $group->refresh();

        $this->assertNull($group->banner_image_path);
        $this->assertNull($group->avatar_image_path);
        $this->assertFalse(Storage::disk('public')->exists('group-banners/test-banner.jpg'));
        $this->assertFalse(Storage::disk('public')->exists('group-avatars/test-avatar.jpg'));
    }

    public function test_non_creator_cannot_upload_images()
    {
        $creator = User::factory()->create();
        $otherUser = User::factory()->create();
        $group = Group::factory()->create();

        // Attach the creator as the first approved member
        $group->users()->attach($creator->id, ['approved' => true]);
        // Attach the other user as a member
        $group->users()->attach($otherUser->id, ['approved' => true]);

        $bannerFile = UploadedFile::fake()->image('banner.jpg');

        $response = $this->actingAs($otherUser)
            ->post(route('groups.update-images', $group), [
                'banner_image' => $bannerFile,
            ]);

        $response->assertStatus(403);
    }

    public function test_group_creation_with_images()
    {
        $user = User::factory()->create();

        $bannerFile = UploadedFile::fake()->image('banner.jpg', 1200, 400);
        $avatarFile = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)
            ->post(route('groups.store'), [
                'name' => 'Test Group',
                'description' => 'Test Description',
                'banner_image' => $bannerFile,
                'avatar_image' => $avatarFile,
            ]);

        $response->assertRedirect(route('groups.index'));

        $group = Group::where('name', 'Test Group')->first();
        $this->assertNotNull($group);
        $this->assertNotNull($group->banner_image_path);
        $this->assertNotNull($group->avatar_image_path);
        $this->assertTrue(Storage::disk('public')->exists($group->banner_image_path));
        $this->assertTrue(Storage::disk('public')->exists($group->avatar_image_path));
    }
}
