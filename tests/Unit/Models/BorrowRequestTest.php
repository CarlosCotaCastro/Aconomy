<?php

namespace Tests\Unit\Models;

use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BorrowRequestTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_relationships()
    {
        $borrowRequest = BorrowRequest::factory()->create();

        $this->assertInstanceOf(User::class, $borrowRequest->lender);
        $this->assertInstanceOf(User::class, $borrowRequest->borrower);
        $this->assertInstanceOf(Item::class, $borrowRequest->item);
    }

    /** @test */
    public function it_knows_when_it_is_pending()
    {
        $borrowRequest = BorrowRequest::factory()->create([
            'status' => 'pending',
        ]);

        $this->assertTrue($borrowRequest->isPending());
        $this->assertFalse($borrowRequest->isApproved());
        $this->assertFalse($borrowRequest->isDenied());
        $this->assertFalse($borrowRequest->isCompleted());
    }

    /** @test */
    public function it_validates_handover_codes()
    {
        // Invalid code
        $borrowRequest = BorrowRequest::factory()->create([
            'handover_code' => null,
            'handover_code_expires_at' => null,
        ]);

        $this->assertFalse($borrowRequest->isHandoverCodeValid());

        // Expired code
        $borrowRequest = BorrowRequest::factory()->create([
            'handover_code' => 'ABC123',
            'handover_code_expires_at' => now()->subHour(),
        ]);

        $this->assertFalse($borrowRequest->isHandoverCodeValid());

        // Valid code
        $borrowRequest = BorrowRequest::factory()->create([
            'handover_code' => 'ABC123',
            'handover_code_expires_at' => now()->addHour(),
        ]);

        $this->assertTrue($borrowRequest->isHandoverCodeValid());
    }
}
