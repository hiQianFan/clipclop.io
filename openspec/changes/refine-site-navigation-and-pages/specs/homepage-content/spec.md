## Purpose

Give visitors a short path from understanding ClipClop through inspecting a faithful product demonstration to trusting and downloading the application.

## ADDED Requirements

### Requirement: Home has a focused content hierarchy
Home SHALL contain, in order, the shared header, hero, interactive product demonstration, short privacy and open-source statement, closing download area, and shared footer.

#### Scenario: Reviewing Home
- **WHEN** a visitor reads Home from top to bottom
- **THEN** the page progresses from product value to demonstration, trust evidence, and download without a standalone feature-card grid

### Requirement: Hero provides platform downloads
The hero SHALL introduce ClipClop with concise product copy and provide macOS and Windows download actions using stable first-party platform endpoints.

#### Scenario: Downloading from the hero
- **WHEN** a visitor activates a platform download action
- **THEN** the request uses `/download/macos` or `/download/windows`

### Requirement: Demonstration remains faithful and operable
The interactive demonstration SHALL represent existing app behavior, support its documented keyboard interactions, and use compact scroll steps that let visitors move through items efficiently.

#### Scenario: Browsing demonstration items
- **WHEN** a visitor scrolls or selects an item
- **THEN** the selected list item, preview, descriptive copy, and scroll position remain synchronized

### Requirement: Trust statement is concise
Home SHALL include a compact statement that ClipClop stores clipboard history locally, works offline for core operations, does not upload clipboard content, gives users control over retention limits and deletion, and is open source and auditable, with links to source code and Privacy.

#### Scenario: Verifying privacy claims
- **WHEN** a visitor reaches the trust statement
- **THEN** they can open the source repository or Privacy page for supporting detail

### Requirement: Closing download area includes release context
The closing download area SHALL provide one Download action leading to `/download`, current-version context when available, and a link to the complete Changelog without embedding the full release history on Home.

#### Scenario: Release data is unavailable
- **WHEN** current-version data cannot be loaded
- **THEN** the Download action remains available without an error trace
