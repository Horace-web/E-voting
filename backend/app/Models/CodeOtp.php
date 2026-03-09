<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CodeOtp extends Model
{
    use HasUuids;
    protected $table = 'codes_otp';
    const TYPE_LOGIN = 'login';
    const TYPE_RESET_PASSWORD = 'reset_password';

    protected $fillable = [
        'email',
        'code',
        'type',
        'expire_at',
        'utilise',
    ];

    protected $casts = [
        'expire_at' => 'datetime',
        'utilise'   => 'boolean',
    ];
}
