<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "API Vote Électronique",
    description: "API pour le système de vote électronique"
)]
#[OA\Server(
    url: 'http://localhost:8000',
    description: 'Serveur Local'
)]
class OpenApiDefinition
{
}
