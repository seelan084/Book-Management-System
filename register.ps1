$body = @{
    username = 'admin'
    password = 'admin123'
    admin = $true
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
}

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8081/api/auth/register' -Method Post -Body $body -Headers $headers
    Write-Host "Registration successful:"
    $response | ConvertTo-Json
} catch {
    Write-Host "Registration failed:"
    Write-Host "Status code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response body:"
    $_.ErrorDetails.Message
} 