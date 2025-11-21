# Script de teste para o webhook do chatbot AG Music
# Este script testa a comunicação com o webhook

Write-Host "=== Teste de Webhook AG Music ===" -ForegroundColor Cyan
Write-Host ""

# URL do webhook
$webhookUrl = "https://webhook.agmusic.cloud/webhook/botagmusic"

# Teste 1: Mensagem simples
Write-Host "Teste 1: Mensagem simples" -ForegroundColor Yellow
$body1 = @{
    message = "Olá"
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    user_id = "test_user_1"
    source = "website"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "✓ Resposta recebida: $response1" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: Pergunta sobre serviços
Write-Host "Teste 2: Pergunta sobre serviços" -ForegroundColor Yellow
$body2 = @{
    message = "Quais serviços vocês oferecem?"
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    user_id = "test_user_2"
    source = "website"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "✓ Resposta recebida: $response2" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 3: Pergunta sobre preços
Write-Host "Teste 3: Pergunta sobre preços" -ForegroundColor Yellow
$body3 = @{
    message = "Quanto custa uma gravação?"
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    user_id = "test_user_3"
    source = "website"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body3 -ContentType "application/json"
    Write-Host "✓ Resposta recebida: $response3" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Teste Concluido ===" -ForegroundColor Cyan
