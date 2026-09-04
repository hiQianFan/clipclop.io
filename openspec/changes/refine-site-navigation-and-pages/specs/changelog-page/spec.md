## Purpose

Let visitors inspect ClipClop release history independently of Home while preserving GitHub as the public source record rather than the primary download path.

## ADDED Requirements

### Requirement: Changelog is a dedicated page
`/changelog` SHALL list published ClipClop versions with release dates and notes, identify the latest version, and link to the original GitHub release record.

#### Scenario: Loading published releases
- **WHEN** release data is available
- **THEN** the page renders published non-draft releases in reverse chronological order

### Requirement: Release failure degrades quietly
The Changelog SHALL cache successful release history locally, render cached history before requesting fresh data on every visit, and retain that history when GitHub is slow or unavailable. A clear fallback state SHALL be shown only when no cached history exists.

#### Scenario: GitHub API failure
- **WHEN** the release request fails or is rate limited
- **THEN** cached history remains visible, or the page shows a localized unavailable state when no cache exists, without uncaught errors

### Requirement: Downloads remain first-party
The Changelog SHALL show one page-level Download action in its header area, route it to `/download`, and SHALL NOT embed download actions in individual release entries.

#### Scenario: Downloading from Changelog
- **WHEN** a visitor activates Download from the Changelog header
- **THEN** the browser navigates to `/download` to choose a platform

### Requirement: Release notes follow the website locale
The Changelog SHALL select the `## 中文` or `## English` section from each release body according to the active website locale, render its supported Markdown structure as HTML, and omit the shared `> 安装提示 / Installation note` block.

#### Scenario: Viewing English release notes
- **WHEN** the website locale is English
- **THEN** only the English section is rendered with headings, lists, emphasis, code, and links represented as HTML
