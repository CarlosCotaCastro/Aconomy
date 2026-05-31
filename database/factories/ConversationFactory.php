<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        $one = User::factory()->create();
        $two = User::factory()->create();

        return [
            'user_one_id' => min($one->id, $two->id),
            'user_two_id' => max($one->id, $two->id),
            'last_message_at' => now(),
        ];
    }
}
