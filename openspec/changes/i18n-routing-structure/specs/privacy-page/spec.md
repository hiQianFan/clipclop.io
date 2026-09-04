## MODIFIED Requirements

### Requirement: Local data boundary is explicit
Each localized Privacy page SHALL state in its route language that clipboard contents and history remain on the device, core clipboard operations work offline, and clipboard content is not uploaded for storage or analysis.

#### Scenario: Reviewing data handling
- **WHEN** a visitor reads either localized data-handling section
- **THEN** local storage, offline operation, deletion controls, and retention controls are clearly described in the route language

### Requirement: Privacy limits are stated plainly
Privacy SHALL distinguish operating-system disk protection from application-level database encryption, explain that ClipClop does not classify sensitive content, and describe file-preview access without implying that source files are copied or uploaded.

#### Scenario: Reviewing protection limits
- **WHEN** a visitor evaluates local data protection
- **THEN** the localized page identifies both the available operating-system protections and the current application-level limits

### Requirement: Open-source auditability is disclosed
Privacy SHALL link to the public source repository and explain in the route language that the implementation can be independently inspected.

#### Scenario: Opening source code
- **WHEN** a visitor activates the source link
- **THEN** the public ClipClop repository opens

### Requirement: Necessary network access reflects the current boundary
Privacy SHALL identify automatic update, download, and website release-data requests, name `clipclop.io` as the current first-party endpoint without retaining obsolete distribution domains, and state that those requests do not contain clipboard history.

#### Scenario: Reviewing network destinations
- **WHEN** a visitor reads the network-access section
- **THEN** the localized page describes the current `clipclop.io` and GitHub destinations without migration-history URLs
