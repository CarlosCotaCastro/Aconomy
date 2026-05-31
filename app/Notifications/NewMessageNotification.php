<?php

namespace App\Notifications;

use App\Models\Message;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class NewMessageNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(
        protected Message $message,
        protected User $sender,
    ) {}

    /**
     * Delivery channels. Email is only used when the recipient opted in.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];

        if ($notifiable->email_on_message) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * @return array<int, string>
     */
    public function broadcastOn(): array
    {
        return ['App.Models.User.'.$this->message->conversation->otherParticipant($this->sender)->id];
    }

    public function broadcastAs(): string
    {
        return 'notification';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New message from '.$this->sender->name)
            ->greeting('Hello '.$notifiable->name.',')
            ->line($this->sender->name.' sent you a message:')
            ->line('"'.Str::limit($this->message->body, 140).'"')
            ->action('Read & Reply', url('/messages/'.$this->message->conversation_id))
            ->line('You can turn these emails off in your profile settings.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_message',
            'conversation_id' => $this->message->conversation_id,
            'message_id' => $this->message->id,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'preview' => Str::limit($this->message->body, 80),
            'title' => 'New Message',
            'body' => $this->sender->name.' sent you a message',
            'url' => '/messages/'.$this->message->conversation_id,
        ];
    }
}
