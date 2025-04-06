<?php

namespace App\Notifications;

use App\Models\BorrowRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BorrowRequestNotification extends Notification implements ShouldQueue
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
        $item = $this->borrowRequest->item;
        $imageHtml = '';

        // Add item image if available
        if ($item->image_path) {
            $imageUrl = url('storage/'.$item->image_path);
            $imageHtml = '<div style="text-align: center; margin-bottom: 15px;">
                <img src="'.$imageUrl.'" alt="'.$item->name.'" style="max-width: 300px; max-height: 200px; object-fit: contain;">
                <p style="margin-top: 5px; color: #718096; font-size: 14px;">Item: '.$item->name.'</p>
            </div>';
        }

        return (new MailMessage)
            ->subject('New Borrow Request')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line($this->borrowRequest->borrower->name.' would like to borrow your '.$this->borrowRequest->item->name.'.')
            ->when($imageHtml, function ($message) use ($imageHtml) {
                return $message->line($imageHtml);
            })
            ->when(! empty($this->borrowRequest->message), function ($message) {
                return $message->line('Message: "'.$this->borrowRequest->message.'"');
            })
            ->action('Respond to Request', url('/borrow-requests/'.$this->borrowRequest->id))
            ->line('This request will expire if not responded to within 7 days.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'borrow_request',
            'borrow_request_id' => $this->borrowRequest->id,
            'item_id' => $this->borrowRequest->item_id,
            'item_name' => $this->borrowRequest->item->name,
            'borrower_id' => $this->borrowRequest->borrower_id,
            'borrower_name' => $this->borrowRequest->borrower->name,
            'message' => $this->borrowRequest->message,
            'title' => 'New Borrow Request',
            'body' => $this->borrowRequest->borrower->name.' wants to borrow your '.$this->borrowRequest->item->name,
            'url' => '/borrow-requests/'.$this->borrowRequest->id,
        ];
    }
}
