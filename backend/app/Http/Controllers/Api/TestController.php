<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use OpenApi\Attributes as OA;

class TestController extends Controller
{
    #[OA\Get(
        path: '/api/test',
        summary: 'Test endpoint',
        tags: ['Test'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'API fonctionne')
                    ]
                )
            )
        ]
    )]
    public function test()
    {
        return response()->json(['message' => 'API fonctionne']);
    }
}