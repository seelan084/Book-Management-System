# this wil Test API Script

# Config down here
$baseUrl = "http://localhost:8081/api"
$headers = @{
    "Content-Type" = "application/json"
}

# this will test admin registration
Write-Host "`nTesting Admin Registration..." -ForegroundColor Green
$registerAdminBody = @{
    username = "admin"
    password = "admin123"
    admin = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method Post -Headers $headers -Body $registerAdminBody
    Write-Host "Admin Registration Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Admin Registration Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# this will test user registration
Write-Host "`nTesting User Registration..." -ForegroundColor Green
$registerBody = @{
    username = "newuser"
    password = "password123"
    admin = $false
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method Post -Headers $headers -Body $registerBody
    Write-Host "User Registration Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "User Registration Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# this will test admin login  
#admin login is fixed and hardcoded in the code
Write-Host "`nTesting Admin Login..." -ForegroundColor Green
$loginAdminBody = @{
    username = "admin"    #use this for admin login and password
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Headers $headers -Body $loginAdminBody
    Write-Host "Admin Login Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
    
    # Extract admin token for subsequent requests
    $adminToken = ($response.Content | ConvertFrom-Json).token
    $adminHeaders = $headers.Clone()
    $adminHeaders["Authorization"] = "Bearer $adminToken"
} catch {
    Write-Host "Admin Login Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# Test User Login
Write-Host "`nTesting User Login..." -ForegroundColor Green
$loginBody = @{
    username = "newuser"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Headers $headers -Body $loginBody
    Write-Host "User Login Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
    
    # Extract user token for subsequent requests
    $userToken = ($response.Content | ConvertFrom-Json).token
    $userHeaders = $headers.Clone()
    $userHeaders["Authorization"] = "Bearer $userToken"
} catch {
    Write-Host "User Login Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# Test Add Book (Admin only)
Write-Host "`nTesting Add Book (Admin)..." -ForegroundColor Green
$bookBody = @{
    title = "Test Book"
    author = "Test Author"
    isbn = "1234567890"
    publicationYear = 2024
    description = "A test book description"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/books" -Method Post -Headers $adminHeaders -Body $bookBody
    Write-Host "Add Book Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Add Book Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# Test Get All Books (requires authentication)
Write-Host "`nTesting Get All Books..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/books" -Method Get -Headers $userHeaders
    Write-Host "Get All Books Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Get All Books Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
}

# Test Search Books
Write-Host "`nTesting Search Books..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/books/search?title=Test" -Method Get -Headers $userHeaders
    Write-Host "Search Books Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Search Books Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response Body: $($_.ErrorDetails.Message)"
} 