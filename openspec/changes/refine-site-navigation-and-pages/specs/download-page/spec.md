## Purpose

Provide an official first-party download destination that keeps platform choices clear while decoupling public links from versioned installation filenames.

## ADDED Requirements

### Requirement: Both supported platforms are available
The Download page SHALL present macOS Universal and Windows x64 downloads, MAY emphasize the detected platform, and SHALL NOT hide the other platform.

#### Scenario: Visiting from macOS
- **WHEN** a macOS visitor opens `/download`
- **THEN** macOS may be emphasized and the Windows download remains available

### Requirement: Downloads use stable routes
Platform actions SHALL use `/download/macos` and `/download/windows` and SHALL NOT hard-code versioned R2 object paths or installation filenames.

#### Scenario: Activating Windows download
- **WHEN** a visitor activates the Windows action
- **THEN** the browser requests `/download/windows`

### Requirement: Installation context is honest
The page SHALL display verified compatibility and installation guidance and SHALL distinguish current availability from future infrastructure state.

#### Scenario: Reading installation guidance
- **WHEN** a visitor reviews a platform option
- **THEN** only requirements and signing information verified against the app repository are presented

