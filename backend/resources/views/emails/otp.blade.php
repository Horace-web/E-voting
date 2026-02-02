<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
        <h2 style="color:#2c3e50;">Connexion – Système de Vote Électronique</h2>

        <p>Votre code de connexion est :</p>

        <div style="font-size:32px; font-weight:bold; letter-spacing:6px;
                    background:#eef2ff; padding:15px; text-align:center;
                    border-radius:6px; margin:20px 0;">
            {{ $code }}
        </div>

        <p>⏳ Ce code expire dans <strong>10 minutes</strong>.</p>

        <p style="color:#555;">
            Si vous n’avez pas demandé ce code, ignorez simplement cet email.
        </p>

        <hr>

        <p style="font-size:12px; color:#999;">
            © {{ date('Y') }} Système de Vote Électronique
        </p>
    </div>
</body>
</html>
