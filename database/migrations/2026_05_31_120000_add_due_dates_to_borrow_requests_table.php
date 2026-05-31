<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('borrow_requests', function (Blueprint $table) {
            $table->timestamp('requested_due_at')->nullable()->after('message');
            $table->timestamp('proposed_due_at')->nullable()->after('requested_due_at');
            $table->timestamp('agreed_due_at')->nullable()->after('proposed_due_at');
            $table->enum('status', ['pending', 'approved', 'denied', 'completed', 'expired', 'countered'])
                ->default('pending')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrow_requests', function (Blueprint $table) {
            $table->dropColumn(['requested_due_at', 'proposed_due_at', 'agreed_due_at']);
            $table->enum('status', ['pending', 'approved', 'denied', 'completed', 'expired'])
                ->default('pending')
                ->change();
        });
    }
};
