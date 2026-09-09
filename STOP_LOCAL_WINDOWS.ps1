$ErrorActionPreference = "SilentlyContinue"
$connections = Get-NetTCPConnection -LocalPort 3000 -State Listen

if (-not $connections) {
  Write-Host "[B2B Catalog CMS] No process is listening on port 3000."
  exit 0
}

$connections |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object {
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    Write-Host "[B2B Catalog CMS] Stopped process $_ on port 3000."
  }
