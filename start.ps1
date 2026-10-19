# ==============================================================================
# InfraGraph AI - Script de Inicialização Automatizada (Fullstack)
# ==============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando InfraGraph AI (Dev Mode)   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$RootPath = $PSScriptRoot

# 1. Backend FastAPI
Write-Host "`n[1/2] Inicializando Backend (FastAPI)..." -ForegroundColor Green
$BackendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$RootPath\backend'; Write-Host 'Iniciando servidor FastAPI...' -ForegroundColor Green; python main.py" -PassThru

# 2. Frontend React / Vite
Write-Host "[2/2] Inicializando Frontend (Vite)..." -ForegroundColor Green
$FrontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$RootPath\frontend'; Write-Host 'Iniciando Vite Dev Server...' -ForegroundColor Green; npm run dev" -PassThru

Write-Host "`nAmbos os serviços foram iniciados em janelas dedicadas!" -ForegroundColor Yellow
Write-Host "- Backend API: http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor White
Write-Host "- Frontend Web: http://localhost:5173" -ForegroundColor White
Write-Host "`nPressione qualquer tecla para encerrar ambos os serviços..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Encerramento limpo
if ($BackendProcess -and -not $BackendProcess.HasExited) {
    Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
}
if ($FrontendProcess -and -not $FrontendProcess.HasExited) {
    Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "Serviços encerrados." -ForegroundColor Red
