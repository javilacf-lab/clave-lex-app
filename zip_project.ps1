Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDirectory = "C:\Users\Asus\.gemini\antigravity\scratch\clave-lex"
$zipFile = "C:\Users\Asus\.gemini\antigravity\scratch\clave-lex\dashboard_premium.zip"
$excludeDirs = @("node_modules", ".next", ".git")
$skipZipFiles = @("dashboard_premium.zip", "temp_zip.zip")

If (Test-Path $zipFile) { Remove-Item $zipFile }
$archive = [System.IO.Compression.ZipFile]::Open($zipFile, "Create")
$files = Get-ChildItem -Path $sourceDirectory -Recurse | Where-Object { 
  $exclude = $false
  
  if ($_.PSIsContainer) { return $false }

  foreach ($dir in $excludeDirs) {
    if ($_.FullName -match "\\$dir\\") { $exclude = $true; break }
  }
  
  foreach ($zFile in $skipZipFiles) {
    if ($_.Name -eq $zFile) { $exclude = $true; break }
  }

  !$exclude
}

foreach ($file in $files) {
  $relativePath = $file.FullName.Substring($sourceDirectory.Length + 1)
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relativePath, "Optimal")
}
$archive.Dispose()

Write-Host "ZIP file created successfully!"
