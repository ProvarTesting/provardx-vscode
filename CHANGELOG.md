# Change Log

All notable changes to the "provardx-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 1.0.1 - 2020-09-28

### Fixed

-   Invalid Property File was generated on Windows because backslash('\') was not escaped in the file paths

## 1.0.0 - 2020-07-20

### Added

-   Added basic commands:
    -   ProvarDX: Create Properties File: Command to create basic provardx-properties.json file using standard template
    -   ProvarDX: Validate Properties File: Command to validate the provardx property file against standard JSON Schema
    -   ProvarDX: Run Testcases: Runs the specified list of Provar test cases against the currently configured SFDX defaultuserrname
