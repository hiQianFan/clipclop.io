## Purpose

Let visitors inspect ClipClop release history independently of Home while preserving GitHub as the public source record rather than the primary download path.

## ADDED Requirements

### Requirement: Changelog is a dedicated page
`/changelog` SHALL list published ClipClop versions with release dates and notes, identify the latest version, and link to the original GitHub release record.

#### Scenario: Loading published releases
- **WHEN** release data is available
- **THEN** the page renders published non-draft releases in reverse chronological order

### Requirement: Release failure degrades quietly
The Changelog SHALL remain navigable and display a clear fallback state when GitHub release data is unavailable.

#### Scenario: GitHub API failure
- **WHEN** the release request fails or is rate limited
- **THEN** the page shows a localized unavailable state without uncaught errors

### Requirement: Downloads remain first-party
Download actions presented with release history SHALL route through ClipClop's stable platform endpoints rather than GitHub release assets.

#### Scenario: Downloading from Changelog
- **WHEN** a visitor chooses a platform download
- **THEN** the request uses the corresponding `/download/{platform}` route

