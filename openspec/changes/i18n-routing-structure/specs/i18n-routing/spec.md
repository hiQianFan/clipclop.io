## Purpose

Give every supported language a stable, shareable URL so visitors and search engines receive the intended locale without client-side content replacement.

## ADDED Requirements

### Requirement: Public pages use language-prefixed routes
The site SHALL publish Home, Download, Changelog, and Privacy in Chinese under `/zh` and in English under `/en`. Equivalent language variants SHALL use the same path suffix.

#### Scenario: Opening an English page directly
- **WHEN** a visitor requests `/en/privacy`
- **THEN** the server returns the English Privacy page without requiring client-side locale detection

### Requirement: Bare page routes preserve compatibility
Bare content routes SHALL redirect to the equivalent path under `/zh` or `/en` using the request language, with English as the fallback.

#### Scenario: Opening a legacy content URL
- **WHEN** a visitor requests `/privacy` with Chinese as the preferred supported language
- **THEN** the response redirects to `/zh/privacy`

### Requirement: Locale switching preserves destination
Changing language SHALL navigate to the equivalent page in the target language and SHALL persist the explicit choice for later visits.

#### Scenario: Switching language on Changelog
- **WHEN** a visitor on `/zh/changelog` selects English
- **THEN** the browser navigates to `/en/changelog` and records English as the chosen locale
