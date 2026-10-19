$ErrorActionPreference = "Stop"

$interfaceAlias = "Wi-Fi"
$ruleName = "Lente - rete locale porta 4173"
$nodePath = "C:\Program Files\nodejs\node.exe"

Set-NetConnectionProfile -InterfaceAlias $interfaceAlias -NetworkCategory Private

$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existingRule) {
  Set-NetFirewallRule -DisplayName $ruleName -Enabled True -Profile Private -Direction Inbound -Action Allow
} else {
  New-NetFirewallRule `
    -DisplayName $ruleName `
    -Description "Consente l'accesso a Lente soltanto dalla rete locale privata." `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 4173 `
    -Profile Private `
    -RemoteAddress LocalSubnet `
    -Program $nodePath | Out-Null
}
