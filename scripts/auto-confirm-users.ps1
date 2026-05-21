param(
  [Parameter(Mandatory = $false)]
  [string]$SupabaseUrl = "https://cnzfmrivwohjzeoephug.supabase.co",

  [Parameter(Mandatory = $false)]
  [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
)

<#
.SYNOPSIS
  Auto-confirms all unconfirmed Supabase Auth users via the Admin API.
.DESCRIPTION
  This script must be run outside of a browser context (e.g., from PowerShell/terminal).
  It calls the Supabase Admin API to set email_confirmed_at for all users who
  haven't confirmed their email yet. This is necessary because the browser cannot
  use the service role key (blocked by User-Agent check).
#>

Write-Host "=== Auto-Confirming Unconfirmed Supabase Users ===" -ForegroundColor Cyan
Write-Host "URL: $SupabaseUrl" -ForegroundColor Gray

# First, get the list of users via the admin API
$headers = @{
  "Content-Type"  = "application/json"
  "apikey"        = $ServiceRoleKey
  "Authorization" = "Bearer $ServiceRoleKey"
}

try {
  $usersResponse = Invoke-RestMethod -Uri "$SupabaseUrl/auth/v1/admin/users" -Headers $headers -Method Get
  $users = $usersResponse.users
} catch {
  Write-Host "Failed to fetch users. Trying alternative method..." -ForegroundColor Yellow
  # The admin API might not list all users, try the SQL approach via GoTrue
  try {
    $usersResponse = & curl.exe -s "$SupabaseUrl/auth/v1/admin/users" -H "apikey: $ServiceRoleKey" -H "Authorization: Bearer $ServiceRoleKey"
    $parsed = $usersResponse | ConvertFrom-Json
    $users = $parsed.users
  } catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
  }
}

$confirmed = 0
$skipped = 0
$errors = 0

foreach ($user in $users) {
  $userId = $user.id
  $userEmail = $user.email
  $userName = $user.user_metadata.username

  if ($user.email_confirmed_at) {
    Write-Host "  [SKIP] $userName ($userEmail) - already confirmed" -ForegroundColor Gray
    $skipped++
    continue
  }

  Write-Host "  [CONFIRMING] $userName ($userEmail)..." -NoNewline

  $body = '{"email_confirm": true}' | ConvertTo-Json -Compress
  try {
    $response = & curl.exe -s -X PUT "$SupabaseUrl/auth/v1/admin/users/$userId" `
      -H "Content-Type: application/json" `
      -H "apikey: $ServiceRoleKey" `
      -H "Authorization: Bearer $ServiceRoleKey" `
      -d $body

    $result = $response | ConvertFrom-Json
    if ($result.email_confirmed_at) {
      Write-Host " DONE" -ForegroundColor Green
      $confirmed++
    } else {
      Write-Host " FAILED - $response" -ForegroundColor Red
      $errors++
    }
  } catch {
    Write-Host " ERROR - $_" -ForegroundColor Red
    $errors++
  }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "  Confirmed: $confirmed" -ForegroundColor Green
Write-Host "  Skipped:   $skipped" -ForegroundColor Gray
Write-Host "  Errors:    $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })
