<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class TestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/test",
     *     tags={"Test"},
     *     summary="Test endpoint",
     *     @OA\Response(
     *         response=200,
     *         description="Succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="API fonctionne")
     *         )
     *     )
     * )
     */
    public function test()
    {
        return response()->json(['message' => 'API fonctionne']);
    }
}
