<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MessagingTest extends TestCase
{
    use RefreshDatabase;

    public function test_starting_a_conversation_creates_one_and_redirects(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $response = $this->actingAs($userA)->post(route('messages.start', $userB));

        $conversation = Conversation::first();
        $this->assertNotNull($conversation);
        $this->assertSame(min($userA->id, $userB->id), $conversation->user_one_id);
        $this->assertSame(max($userA->id, $userB->id), $conversation->user_two_id);
        $response->assertRedirect(route('messages.show', $conversation));
    }

    public function test_starting_a_conversation_is_idempotent(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $this->actingAs($userA)->post(route('messages.start', $userB));
        $this->actingAs($userB)->post(route('messages.start', $userA));

        $this->assertDatabaseCount('conversations', 1);
    }

    public function test_sending_a_message_persists_and_notifies_recipient(): void
    {
        Notification::fake();

        $sender = User::factory()->create();
        $recipient = User::factory()->create();
        $conversation = Conversation::between($sender->id, $recipient->id);

        $this->actingAs($sender)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'body' => 'Hello there!',
        ])->assertRedirect(route('messages.show', $conversation));

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'body' => 'Hello there!',
        ]);
        $this->assertNotNull($conversation->fresh()->last_message_at);

        Notification::assertSentTo($recipient, NewMessageNotification::class);
    }

    public function test_message_email_is_sent_only_when_recipient_opted_in(): void
    {
        Notification::fake();

        $sender = User::factory()->create();
        $optedOut = User::factory()->create(['email_on_message' => false]);
        $conversation = Conversation::between($sender->id, $optedOut->id);

        $this->actingAs($sender)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'body' => 'No email please',
        ]);

        Notification::assertSentTo(
            $optedOut,
            NewMessageNotification::class,
            function ($notification, $channels) {
                return ! in_array('mail', $channels) && in_array('database', $channels);
            }
        );
    }

    public function test_message_email_is_sent_when_recipient_opted_in(): void
    {
        Notification::fake();

        $sender = User::factory()->create();
        $optedIn = User::factory()->create(['email_on_message' => true]);
        $conversation = Conversation::between($sender->id, $optedIn->id);

        $this->actingAs($sender)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'body' => 'Email me',
        ]);

        Notification::assertSentTo(
            $optedIn,
            NewMessageNotification::class,
            function ($notification, $channels) {
                return in_array('mail', $channels);
            }
        );
    }

    public function test_non_participant_cannot_view_conversation(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $intruder = User::factory()->create();
        $conversation = Conversation::between($userA->id, $userB->id);

        $this->actingAs($intruder)
            ->get(route('messages.show', $conversation))
            ->assertStatus(403);
    }

    public function test_non_participant_cannot_send_message(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $intruder = User::factory()->create();
        $conversation = Conversation::between($userA->id, $userB->id);

        $this->actingAs($intruder)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'body' => 'I should not be here',
        ])->assertStatus(403);
    }

    public function test_viewing_conversation_marks_incoming_messages_read(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $conversation = Conversation::between($userA->id, $userB->id);

        // B sends a message to A
        $this->actingAs($userB)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'body' => 'Unread message',
        ]);

        $this->assertDatabaseHas('messages', ['read_at' => null]);

        // A opens the thread
        $this->actingAs($userA)->get(route('messages.show', $conversation))->assertOk();

        $this->assertDatabaseMissing('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $userB->id,
            'read_at' => null,
        ]);
    }
}
