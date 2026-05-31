<?php

namespace App\Notifications;

use App\Models\BorrowRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BorrowRequestCounteredNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    protected $borrowRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(BorrowRequest $borrowRequest)
    {
        $this->borrowRequest = $borrowRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, string>
     */
    public function broadcastOn(): array
    {
        return ['App.Models.User.'.$this->borrowRequest->borrower_id];
    }

    public function broadcastAs(): string
    {
        return 'notification';
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('A shorter borrowing period was proposed')
            ->greeting('Hello '.$notifiable->name.',')
            ->line($this->borrowRequest->lender->name.' proposed a shorter return date for your request to borrow '.$this->borrowRequest->item->name.'.')
            ->line('Proposed return date: '.optional($this->borrowRequest->proposed_due_at)->toFormattedDateString())
            ->action('Review Proposal', url('/borrow-requests/'.$this->borrowRequest->id))
            ->line('You can accept the proposed date or decline the request.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'borrow_request_countered',
            'borrow_request_id' => $this->borrowRequest->id,
            'item_id' => $this->borrowRequest->item_id,
            'item_name' => $this->borrowRequest->item->name,
            'lender_id' => $this->borrowRequest->lender_id,
            'lender_name' => $this->borrowRequest->lender->name,
            'requested_due_at' => optional($this->borrowRequest->requested_due_at)->toIso8601String(),
            'proposed_due_at' => optional($this->borrowRequest->proposed_due_at)->toIso8601String(),
            'title' => 'Shorter Period Proposed',
            'body' => $this->borrowRequest->lender->name.' proposed a shorter return date for '.$this->borrowRequest->item->name,
            'url' => '/borrow-requests/'.$this->borrowRequest->id,
        ];
    }
}
