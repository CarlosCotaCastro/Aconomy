<?php

namespace Database\Factories;

use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BorrowRequestFactory extends Factory
{
    protected $model = BorrowRequest::class;

    public function definition(): array
    {
        $lender = User::factory()->create();
        $borrower = User::factory()->create();
        $item = Item::factory()->create(['user_id' => $lender->id]);
        
        return [
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'message' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'denied', 'completed']),
            'expires_at' => now()->addDays(7),
            'handover_code' => strtoupper($this->faker->lexify('??????')),
            'handover_code_expires_at' => now()->addHours(1),
            'completed_at' => null,
        ];
    }
    
    public function pending(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'completed_at' => null,
            ];
        });
    }
    
    public function approved(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
                'completed_at' => null,
            ];
        });
    }
    
    public function denied(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'denied',
                'completed_at' => null,
            ];
        });
    }
    
    public function completed(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
                'completed_at' => now(),
            ];
        });
    }
} 