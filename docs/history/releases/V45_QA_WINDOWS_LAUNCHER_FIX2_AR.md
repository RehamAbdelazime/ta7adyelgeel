# V45 – Windows QA Launcher Fix 2

## Problem
The previous `RUN_FULL_QA_WINDOWS.bat` contained an unescaped parenthesis in an `echo` statement inside a parenthesized `if` block. Windows CMD could exit during batch parsing *before* reaching the `pause` line. This explains a CMD window opening and closing immediately.

## Fix
- The Windows `.bat` file is now only a simple wrapper; **all installation and QA orchestration runs in** `scripts/qa/windows-qa-setup.cjs`.
- `pause` is always reached after the Node command completes, including failure paths.
- The setup records output and errors in `qa-artifacts/qa-setup.log`.
- Uses the existing project installation when present; installs Playwright only in `.qa-tools`, without changing the root npm lockfile.
- Checks/installs Chromium and runs `npm run qa:full`, which generates the QA HTML reports.
- No game logic or assets are changed.

## Install
Extract the patch ZIP **inside the V45 QA HOTFIX project root**, where `package.json`, `RUN_FULL_QA_WINDOWS.bat` and `src` already exist. Allow overwrites. Double-click `RUN_FULL_QA_WINDOWS.bat`.

## If an error remains
Do not send only a photo of an empty window: open `qa-artifacts/qa-setup.log` and share it. You can also open Command Prompt in the project directory and run `RUN_FULL_QA_WINDOWS.bat` to keep the session visible.

## Verification limit
The Windows launcher has been analyzed and the JavaScript supervisor self-test has passed in a non-Windows environment. Actual Playwright/Chromium installation and GUI tests must run on the user's Windows machine.
