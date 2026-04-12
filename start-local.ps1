$ErrorActionPreference = "Stop"

$port = 8000
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "TUKI! STICKERS MVP" -ForegroundColor Green
Write-Host "Sirviendo proyecto desde: $root"
Write-Host ""

$addresses = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike "127.*" -and
    $_.IPAddress -notlike "169.254.*" -and
    $_.PrefixOrigin -ne "WellKnown"
  } |
  Select-Object -ExpandProperty IPAddress -Unique

if ($addresses) {
  Write-Host "Abre desde tu celular, conectado al mismo Wi-Fi:"
  foreach ($address in $addresses) {
    Write-Host "http://$address`:$port"
  }
  Write-Host ""
}

Write-Host "Presiona Ctrl+C para detener el servidor."
Write-Host ""

Set-Location $root
py -m http.server $port
