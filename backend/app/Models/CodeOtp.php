<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class CodeOtp extends Model
{
    use HasUuid;

    protected $table = 'codes_otp';

    protected $fillable = [
        'email',
        'code',
        'expire_at',
        'utilise',
    ];

    public $timestamps = true;
}
