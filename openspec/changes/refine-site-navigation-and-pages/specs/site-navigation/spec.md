## Purpose

Provide consistent, accessible navigation between ClipClop's primary website destinations on desktop and mobile without duplicating the Home destination.

## ADDED Requirements

### Requirement: Brand is the Home entry
The header SHALL present the ClipClop icon and name as a link to `/` and SHALL NOT repeat Home as a separate navigation item.

#### Scenario: Returning Home
- **WHEN** a visitor activates the ClipClop brand from any page
- **THEN** the browser navigates to `/`

### Requirement: Desktop exposes primary destinations
The desktop header SHALL expose the brand followed by GitHub stars, with Download, Changelog, Privacy, language, and theme controls aligned on the opposite side.

#### Scenario: Desktop navigation
- **WHEN** the header is displayed at desktop width
- **THEN** Download, Changelog, and Privacy are visible without opening a menu

### Requirement: Mobile keeps navigation compact
The mobile header SHALL show the ClipClop brand, GitHub star metric, and a More control. More SHALL open a full-viewport navigation surface with a clear close control, large destination targets, and inline expandable language and appearance choices; it SHALL NOT create overlapping popovers.

#### Scenario: Opening mobile navigation
- **WHEN** a visitor activates More at mobile width
- **THEN** every primary destination and utility control is available in one accessible menu

### Requirement: GitHub state remains anonymous
The site SHALL show the public star count with a GitHub mark, tabular numeric count, and visually balanced yellow star, cache successful values for six hours, and SHALL NOT request GitHub authorization or imply that the current visitor has starred the repository.

#### Scenario: Viewing GitHub stars
- **WHEN** the public star count is available
- **THEN** the anonymous metric appears without a signed-in or visitor-specific starred state

### Requirement: Localized header geometry is stable
Desktop destination slots SHALL accommodate the longest supported label without wrapping, and changing locale SHALL NOT reorder navigation.

#### Scenario: Switching to English
- **WHEN** a visitor changes the locale from Chinese to English
- **THEN** Download, Changelog, Privacy, and both platform download labels remain on one line

### Requirement: Current destination is identifiable
Page navigation SHALL expose the current destination programmatically and visually, and every interactive control SHALL have a visible keyboard focus state.

#### Scenario: Visiting Privacy
- **WHEN** the visitor is on `/privacy`
- **THEN** Privacy is identified as the current page in the applicable navigation surface
