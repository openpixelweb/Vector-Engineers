# Vector Engineers - Phase 4 end-to-end catalogue test
# Run with: powershell -NoProfile -ExecutionPolicy Bypass -File .\vector-phase4-catalogue-test.ps1
$ErrorActionPreference = 'Stop'
$baseUrl = 'http://localhost:5000/api/v1'

function Post-CatalogueRecord {
    param([string]$Resource, [hashtable]$Payload, [hashtable]$Headers)
    $json = $Payload | ConvertTo-Json -Depth 12
    $result = Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/catalog/$Resource" -Headers $Headers -ContentType 'application/json' -Body $json
    if (-not $result.success -or -not $result.data._id) { throw "Failed to create $Resource" }
    Write-Host ("Created {0}: {1}" -f $Resource, $result.data._id) -ForegroundColor Green
    return $result.data
}

Write-Host 'VECTOR ENGINEERS: PHASE 4 CATALOGUE TEST' -ForegroundColor Cyan
Write-Host 'This creates sample DRAFT records only (not published).'
$email = Read-Host 'Admin email'
$securePassword = Read-Host 'Admin password' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try { $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
try {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    $login = Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/login" -ContentType 'application/json' -Body $body
} finally {
    Remove-Variable password,body -ErrorAction SilentlyContinue
}
if (-not $login.success -or -not $login.accessToken) { throw 'Login failed: expected accessToken' }
$headers = @{ Authorization = "Bearer $($login.accessToken)" }
Write-Host 'Admin login successful.' -ForegroundColor Green
$runId = (Get-Date).ToString('yyyyMMddHHmmss')

$brand = Post-CatalogueRecord -Resource 'brands' -Headers $headers -Payload @{
    name='Catalogue Test Brand'; slug="catalogue-test-brand-$runId"; description='Temporary backend test brand'; status='draft'
}
$group = Post-CatalogueRecord -Resource 'groups' -Headers $headers -Payload @{
    brandId=[string]$brand._id; name='Fans'; slug="fans-$runId"; status='draft'
}
$industry = Post-CatalogueRecord -Resource 'industries' -Headers $headers -Payload @{
    name='Catalogue Test Commercial Buildings'; slug="catalogue-test-commercial-buildings-$runId"; status='draft'
}
$application = Post-CatalogueRecord -Resource 'applications' -Headers $headers -Payload @{
    name='Catalogue Test Ventilation'; slug="catalogue-test-ventilation-$runId"; status='draft'
}
$product = Post-CatalogueRecord -Resource 'products' -Headers $headers -Payload @{
    brandId=[string]$brand._id; groupId=[string]$group._id;
    name='Ceiling Fans'; slug="ceiling-fans-$runId";
    industryIds=@([string]$industry._id); applicationIds=@([string]$application._id);
    status='draft'
}
$model = Post-CatalogueRecord -Resource 'models' -Headers $headers -Payload @{
    productId=[string]$product._id;
    modelName='Sample Ceiling Fan'; manufacturerModelNumber="DEMO-$runId";
    slug="sample-ceiling-fan-$runId";
    specifications=@(@{name='Sweep';value='1200';unit='mm'},@{name='Power';value='35';unit='W'});
    status='draft'
}

$check = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/catalog/models/$($model._id)" -Headers $headers
if (-not $check.success) { throw 'Created model could not be read back' }
Write-Host ''
Write-Host 'SUCCESS: Brand > Group > Product > Model created and read back.' -ForegroundColor Green
Write-Host 'Industry and application linked to the product.'
Write-Host 'All entries are DRAFT and should not appear on the public website.'
Write-Host "Test model: $($model.modelName) ($($model.manufacturerModelNumber))"
Write-Host "Brand ID: $($brand._id)"
Write-Host "Group ID: $($group._id)"
Write-Host "Product ID: $($product._id)"
Write-Host "Model ID: $($model._id)"
Write-Host 'Do not share your password or token.'
