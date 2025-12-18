@echo off
setlocal enabledelayedexpansion

REM ==========================
REM CONFIG – CHANGE THESE
REM ==========================
set "API_URL_STUDENTS=http://localhost:1337/api/students/import-excel"
set "API_URL_EXAMS=http://localhost:1337/api/exams/import-excel"
set "API_URL_TUTORS=http://localhost:1337/api/tutors/import-excel"
set "API_TOKEN="

REM ==========================
REM FIND EXCEL FILE
REM ==========================

set "FILE_PATH="

for %%F in (*.xlsx) do (
    set "FILE_PATH=%%F"
    goto :found
)

for %%F in (*.xls) do (
    set "FILE_PATH=%%F"
    goto :found
)

echo No Excel file (.xlsx or .xls) found in the current folder.
echo Usage: upload_excel.bat
pause
exit /b 1

:found

if not exist "%FILE_PATH%" (
    echo File not found: %FILE_PATH%
    pause
    exit /b 1
)

echo Using file: %FILE_PATH%
echo.

REM Choose MIME type based on extension
set "MIME_TYPE=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
echo %FILE_PATH% | findstr /i ".xls" >nul
if %errorlevel%==0 (
    set "MIME_TYPE=application/vnd.ms-excel"
)

REM ==========================
REM CALL ALL 3 APIS
REM ==========================

echo ==========================
echo 1/3: Sending to STUDENTS
echo URL: %API_URL_STUDENTS%
echo ==========================

if defined API_TOKEN (
    curl -X POST ^
        -H "Authorization: Bearer %API_TOKEN%" ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_STUDENTS%"
) else (
    curl -X POST ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_STUDENTS%"
)
echo.
echo --------------------------



echo ==========================
echo 2/3: Sending to TUTORS
echo URL: %API_URL_TUTORS%
echo ==========================

if defined API_TOKEN (
    curl -X POST ^
        -H "Authorization: Bearer %API_TOKEN%" ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_TUTORS%"
) else (
    curl -X POST ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_TUTORS%"
)
echo.
echo --------------------------

echo ==========================
echo 3/3: Sending to EXAMS
echo URL: %API_URL_EXAMS%
echo ==========================

if defined API_TOKEN (
    curl -X POST ^
        -H "Authorization: Bearer %API_TOKEN%" ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_EXAMS%"
) else (
    curl -X POST ^
        -F "file=@%FILE_PATH%;type=%MIME_TYPE%" ^
        "%API_URL_EXAMS%"
)
echo.
echo --------------------------

echo All uploads finished.
pause
endlocal
