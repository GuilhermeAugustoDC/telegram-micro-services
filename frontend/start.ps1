# Script PowerShell para iniciar o frontend do Telegram MicroSaaS
# Executa o servidor de desenvolvimento Vite

Write-Host "🚀 Iniciando Frontend do Telegram MicroSaaS..." -ForegroundColor Green
Write-Host "📍 Diretório: $(Get-Location)" -ForegroundColor Yellow

# Verifica se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Node.js não encontrado! Instale o Node.js primeiro." -ForegroundColor Red
    Write-Host "💡 Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verifica se o package.json existe
if (!(Test-Path "package.json")) {
    Write-Host "❌ Arquivo package.json não encontrado!" -ForegroundColor Red
    Write-Host "💡 Certifique-se de que está na pasta frontend." -ForegroundColor Yellow
    exit 1
}

# Verifica se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependências já instaladas." -ForegroundColor Cyan
}

# Inicia o servidor de desenvolvimento
Write-Host "🌐 Iniciando servidor Vite..." -ForegroundColor Green
Write-Host "📡 Frontend rodará em: http://localhost:5173" -ForegroundColor Magenta
Write-Host "🔗 Backend proxy: http://localhost:8000/api" -ForegroundColor Magenta
Write-Host ""
Write-Host "⏹️  Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Gray

try {
    npm run dev
} catch {
    Write-Host "❌ Erro ao iniciar o servidor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Tente executar: npm install" -ForegroundColor Yellow
    exit 1
}
