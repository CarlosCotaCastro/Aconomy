<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        $conversation = Conversation::factory()->create();

        return [
            'conversation_id' => $conversation->id,
            'sender_id' => $conversation->user_one_id,
            'body' => $this->faker->sentence(),
            'read_at' => null,
        ];
    }
}
