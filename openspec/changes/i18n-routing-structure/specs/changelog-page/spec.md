## MODIFIED Requirements

### Requirement: Changelog is a dedicated page
`/zh/changelog` and `/en/changelog` SHALL list published ClipClop versions with release dates and localized notes, identify the latest version, and link to the original GitHub release record.

#### Scenario: Loading published releases
- **WHEN** release data is available on either localized route
- **THEN** the page renders published non-draft releases in reverse chronological order

### Requirement: Release failure degrades quietly
The Changelog SHALL cache successful release history locally, render cached history before requesting fresh data on every visit, and retain that history when GitHub is slow or unavailable. A clear fallback state in the route language SHALL be shown only when no cached history exists.

#### Scenario: GitHub API failure
- **WHEN** the release request fails or is rate limited
- **THEN** cached history remains visible, or the page shows a localized unavailable state when no cache exists, without uncaught errors

### Requirement: Downloads remain first-party
The Changelog SHALL show one page-level Download action in its header area, route it to the Download page for the current URL language, and SHALL NOT embed download actions in individual release entries.

#### Scenario: Downloading from Changelog
- **WHEN** a visitor activates Download from `/en/changelog`
- **THEN** the browser navigates to `/en/download` to choose a platform

### Requirement: Release notes follow the website locale
The Changelog SHALL select the `## 中文` section on `/zh/changelog` and the `## English` section on `/en/changelog`, render its supported Markdown structure as HTML, and omit the shared `> 安装提示 / Installation note` block.

#### Scenario: Viewing English release notes
- **WHEN** a visitor opens `/en/changelog`
- **THEN** only the English section is rendered with headings, lists, emphasis, code, and links represented as HTML
