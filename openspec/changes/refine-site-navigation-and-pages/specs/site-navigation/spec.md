## Purpose

Provide consistent, accessible navigation between ClipClop's primary website destinations on desktop and mobile without duplicating the Home destination.

## ADDED Requirements

### Requirement: Brand is the Home entry
The header SHALL present the ClipClop icon and name as a link to `/` and SHALL NOT repeat Home as a separate navigation item.

#### Scenario: Returning Home
- **WHEN** a visitor activates the ClipClop brand from any page
- **THEN** the browser navigates to `/`

### Requirement: Desktop exposes primary destinations
The desktop header SHALL expose Download, Changelog, and Privacy as page-level destinations, followed by GitHub stars, language, and theme controls.

#### Scenario: Desktop navigation
- **WHEN** the header is displayed at desktop width
- **THEN** Download, Changelog, and Privacy are visible without opening a menu

### Requirement: Mobile keeps navigation compact
The mobile header SHALL show the ClipClop brand, GitHub star metric, and a More control. The More menu SHALL contain Download, Changelog, Privacy, language, and appearance controls.

#### Scenario: Opening mobile navigation
- **WHEN** a visitor activates More at mobile width
- **THEN** every primary destination and utility control is available in one accessible menu

### Requirement: GitHub state remains anonymous
The site SHALL show the public star count with a GitHub mark, numeric count, and yellow star, cache successful values for six hours, and SHALL NOT request GitHub authorization or imply that the current visitor has starred the repository.

#### Scenario: Viewing GitHub stars
- **WHEN** the public star count is available
- **THEN** it appears beside the GitHub label without a signed-in or gold starred state

### Requirement: Current destination is identifiable
Page navigation SHALL expose the current destination programmatically and visually, and every interactive control SHALL have a visible keyboard focus state.

#### Scenario: Visiting Privacy
- **WHEN** the visitor is on `/privacy`
- **THEN** Privacy is identified as the current page in the applicable navigation surface
