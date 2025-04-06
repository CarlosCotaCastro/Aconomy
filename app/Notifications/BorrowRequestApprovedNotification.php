<?php

namespace App\Notifications;

use App\Models\BorrowRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BorrowRequestApprovedNotification extends Notification implements ShouldQueue
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Borrow Request Approved')
            ->greeting('Good news, '.$notifiable->name.'!')
            ->line($this->borrowRequest->lender->name.' has approved your request to borrow their '.$this->borrowRequest->item->name.'.')
            ->line('You can now meet with the owner to pick up the item. They will show you a QR code to scan when you receive the item.')
            ->action('View Details', url('/borrow-requests/'.$this->borrowRequest->id))
            ->line('The QR code will be valid for 15 minutes once it is generated.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'borrow_request_id' => $this->borrowRequest->id,
            'item_id' => $this->borrowRequest->item_id,
            'item_name' => $this->borrowRequest->item->name,
            'lender_id' => $this->borrowRequest->lender_id,
            'lender_name' => $this->borrowRequest->lender->name,
            'title' => 'Borrow Request Approved',
            'body' => $this->borrowRequest->lender->name.' has approved your request to borrow their '.$this->borrowRequest->item->name,
        ];
    }
}
