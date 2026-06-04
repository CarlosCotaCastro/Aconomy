<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * List the authenticated user's conversations.
     */
    public function index()
    {
        $user = Auth::user();

        $conversations = Conversation::forUser($user->id)
            ->with([
                'userOne:id,name,profile_image_path',
                'userTwo:id,name,profile_image_path',
                'messages' => fn ($q) => $q->latest()->limit(1),
            ])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(fn (Conversation $conversation) => $this->transformConversation($conversation, $user));

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Show a single conversation thread.
     */
    public function show(Conversation $conversation)
    {
        $user = Auth::user();
        abort_unless($conversation->hasParticipant($user->id), 403);

        $conversation->load([
            'userOne:id,name,profile_image_path',
            'userTwo:id,name,profile_image_path',
        ]);

        // Mark messages from the other participant as read.
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()
            ->with('sender:id,name,profile_image_path')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Messages/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'other' => $conversation->otherParticipant($user)->only(['id', 'name', 'profile_image_path']),
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message within a conversation.
     */
    public function store(Request $request): JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'required|string|max:2000',
        ]);

        $conversation = Conversation::findOrFail($validated['conversation_id']);
        abort_unless($conversation->hasParticipant($user->id), 403);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $validated['body'],
        ]);

        $message->load('sender:id,name,profile_image_path');

        $conversation->update(['last_message_at' => now()]);

        $recipient = $conversation->otherParticipant($user);
        $recipient->notify(new NewMessageNotification($message, $user));

        broadcast(new MessageSent($message))->toOthers();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => $this->transformMessage($message),
            ], 201);
        }

        return redirect()->route('messages.show', $conversation);
    }

    /**
     * Start (or open) a conversation with another user.
     */
    public function start(User $user)
    {
        $authUser = Auth::user();

        if ($user->id === $authUser->id) {
            return redirect()->route('messages.index');
        }

        $conversation = Conversation::between($authUser->id, $user->id);

        return redirect()->route('messages.show', $conversation);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformMessage(Message $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'body' => $message->body,
            'created_at' => $message->created_at->toIso8601String(),
            'sender' => $message->sender->only(['id', 'name', 'profile_image_path']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformConversation(Conversation $conversation, User $user): array
    {
        $other = $conversation->otherParticipant($user);
        $lastMessage = $conversation->messages->first();

        $unreadCount = $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->count();

        return [
            'id' => $conversation->id,
            'other' => $other->only(['id', 'name', 'profile_image_path']),
            'last_message' => $lastMessage ? [
                'body' => $lastMessage->body,
                'created_at' => $lastMessage->created_at->toIso8601String(),
                'from_me' => $lastMessage->sender_id === $user->id,
            ] : null,
            'unread_count' => $unreadCount,
            'last_message_at' => optional($conversation->last_message_at)->toIso8601String(),
        ];
    }
}
