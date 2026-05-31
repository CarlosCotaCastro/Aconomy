<?php

namespace Tests\Feature;

use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\Lending;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BorrowRequestNegotiationTest extends TestCase
{
    use RefreshDatabase;

    private function makeRequestContext(): array
    {
        $lender = User::factory()->create();
        $borrower = User::factory()->create();
        $item = Item::factory()->create(['user_id' => $lender->id]);

        return [$lender, $borrower, $item];
    }

    public function test_borrower_can_submit_request_with_a_return_date(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();
        $due = now()->addDays(14)->toDateString();

        $response = $this->actingAs($borrower)->post(route('borrow-requests.store'), [
            'item_id' => $item->id,
            'message' => 'May I borrow this?',
            'requested_due_at' => $due,
        ]);

        $response->assertRedirect(route('borrow-requests.index'));

        $borrowRequest = BorrowRequest::first();
        $this->assertNotNull($borrowRequest);
        $this->assertSame('pending', $borrowRequest->status);
        $this->assertSame($due, $borrowRequest->requested_due_at->toDateString());
    }

    public function test_request_without_return_date_is_rejected(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();

        $response = $this->actingAs($borrower)->post(route('borrow-requests.store'), [
            'item_id' => $item->id,
            'message' => 'No date provided',
        ]);

        $response->assertSessionHasErrors('requested_due_at');
        $this->assertDatabaseCount('borrow_requests', 0);
    }

    public function test_lender_approval_agrees_to_requested_date(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();
        $due = now()->addDays(10)->startOfDay();

        $borrowRequest = BorrowRequest::factory()->pending()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'requested_due_at' => $due,
        ]);

        $this->actingAs($lender)
            ->post(route('borrow-requests.approve', $borrowRequest))
            ->assertRedirect(route('borrow-requests.show', $borrowRequest));

        $borrowRequest->refresh();
        $this->assertSame('approved', $borrowRequest->status);
        $this->assertSame($due->toDateString(), $borrowRequest->agreed_due_at->toDateString());
    }

    public function test_lender_can_counter_with_a_shorter_period(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();

        $borrowRequest = BorrowRequest::factory()->pending()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'requested_due_at' => now()->addDays(14),
        ]);

        $proposed = now()->addDays(7)->toDateString();

        $this->actingAs($lender)
            ->post(route('borrow-requests.counter', $borrowRequest), [
                'proposed_due_at' => $proposed,
            ])
            ->assertRedirect(route('borrow-requests.show', $borrowRequest));

        $borrowRequest->refresh();
        $this->assertSame('countered', $borrowRequest->status);
        $this->assertSame($proposed, $borrowRequest->proposed_due_at->toDateString());
    }

    public function test_lender_cannot_counter_with_a_longer_period(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();

        $borrowRequest = BorrowRequest::factory()->pending()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'requested_due_at' => now()->addDays(7),
        ]);

        $this->actingAs($lender)
            ->post(route('borrow-requests.counter', $borrowRequest), [
                'proposed_due_at' => now()->addDays(20)->toDateString(),
            ])
            ->assertSessionHasErrors('proposed_due_at');

        $this->assertSame('pending', $borrowRequest->fresh()->status);
    }

    public function test_borrower_can_accept_counter_offer(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();
        $proposed = now()->addDays(6)->startOfDay();

        $borrowRequest = BorrowRequest::factory()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'status' => 'countered',
            'requested_due_at' => now()->addDays(14),
            'proposed_due_at' => $proposed,
        ]);

        $this->actingAs($borrower)
            ->post(route('borrow-requests.accept-counter', $borrowRequest))
            ->assertRedirect(route('borrow-requests.show', $borrowRequest));

        $borrowRequest->refresh();
        $this->assertSame('approved', $borrowRequest->status);
        $this->assertSame($proposed->toDateString(), $borrowRequest->agreed_due_at->toDateString());
    }

    public function test_borrower_can_decline_counter_offer(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();

        $borrowRequest = BorrowRequest::factory()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'status' => 'countered',
            'requested_due_at' => now()->addDays(14),
            'proposed_due_at' => now()->addDays(6),
        ]);

        $this->actingAs($borrower)
            ->post(route('borrow-requests.decline-counter', $borrowRequest))
            ->assertRedirect(route('borrow-requests.index'));

        $this->assertSame('denied', $borrowRequest->fresh()->status);
    }

    public function test_handover_creates_lending_with_agreed_due_date(): void
    {
        [$lender, $borrower, $item] = $this->makeRequestContext();
        $agreed = now()->addDays(9)->startOfDay();

        $borrowRequest = BorrowRequest::factory()->approved()->create([
            'item_id' => $item->id,
            'lender_id' => $lender->id,
            'borrower_id' => $borrower->id,
            'agreed_due_at' => $agreed,
            'handover_code' => 'ABCDEF',
            'handover_code_expires_at' => now()->addMinutes(15),
        ]);

        $this->actingAs($borrower)
            ->post(route('borrow-requests.verify-code', $borrowRequest), [
                'code' => 'ABCDEF',
            ]);

        $lending = Lending::first();
        $this->assertNotNull($lending);
        $this->assertSame($agreed->toDateString(), $lending->due_at->toDateString());
        $this->assertSame('completed', $borrowRequest->fresh()->status);
    }
}
