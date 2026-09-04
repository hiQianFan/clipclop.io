## Purpose

Explain ClipClop's local-data boundary, user-controlled retention, open-source auditability, and limited network behavior in language users can verify.

## ADDED Requirements

### Requirement: Local data boundary is explicit
Privacy SHALL state that clipboard contents and history remain on the device, core clipboard operations work offline, and clipboard content is not uploaded for storage or analysis.

#### Scenario: Reviewing data handling
- **WHEN** a visitor reads the data-handling section
- **THEN** local storage, offline operation, deletion controls, and retention controls are clearly described

### Requirement: Open-source auditability is disclosed
Privacy SHALL link to the public source repository and explain that the implementation can be independently inspected.

#### Scenario: Opening source code
- **WHEN** a visitor activates the source link
- **THEN** the public ClipClop repository opens

### Requirement: Necessary network access reflects migration state
Privacy SHALL identify automatic update, download, and website release-data requests, distinguish the current `clipclop.mapin.net` endpoint from the target `clipclop.io` endpoint until migration completes, and state that those requests do not contain clipboard history.

#### Scenario: Migration is incomplete
- **WHEN** `clipclop.io` distribution has not been deployed
- **THEN** Privacy describes `clipclop.mapin.net` as current and `clipclop.io` as the target rather than claiming the target is live

