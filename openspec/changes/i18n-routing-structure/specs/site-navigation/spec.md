## MODIFIED Requirements

### Requirement: Brand is the Home entry
The header SHALL present the ClipClop icon and name as a link to the Home route for the current URL language and SHALL NOT repeat Home as a separate navigation item.

#### Scenario: Returning Home
- **WHEN** a visitor activates the ClipClop brand from `/en/privacy`
- **THEN** the browser navigates to `/en`

### Requirement: Desktop exposes primary destinations
The desktop header SHALL expose the brand followed by GitHub stars, with Download, Changelog, Privacy, language, and theme controls aligned on the opposite side. Internal destinations SHALL retain the current URL language.

#### Scenario: Desktop navigation
- **WHEN** the header is displayed at desktop width on a Chinese route
- **THEN** Download, Changelog, and Privacy link to their `/zh/*` routes without opening a menu

### Requirement: Mobile keeps navigation compact
The mobile header SHALL show the ClipClop brand, GitHub star metric, and a More control. More SHALL open a full-viewport navigation surface with a clear close control, large destination targets, and inline expandable language and appearance choices; it SHALL NOT create overlapping popovers. Internal destinations SHALL retain the current URL language.

#### Scenario: Opening mobile navigation
- **WHEN** a visitor activates More at mobile width on an English route
- **THEN** every primary destination links to its `/en/*` route and every utility control is available in one accessible menu

### Requirement: GitHub state remains anonymous
The site SHALL show the public star count with a GitHub mark, tabular numeric count, and visually balanced yellow star, cache successful values for six hours, and SHALL NOT request GitHub authorization or imply that the current visitor has starred the repository.

#### Scenario: Viewing GitHub stars
- **WHEN** the public star count is available
- **THEN** the anonymous metric appears without a signed-in or visitor-specific starred state

### Requirement: Localized header geometry is stable
Desktop destination slots SHALL accommodate the longest supported label without wrapping, and changing locale SHALL NOT reorder navigation.

#### Scenario: Switching to English
- **WHEN** a visitor changes the locale from Chinese to English
- **THEN** the equivalent English route loads and Download, Changelog, Privacy, and both platform download labels remain on one line

### Requirement: Current destination is identifiable
Page navigation SHALL expose the current destination programmatically and visually, and every interactive control SHALL have a visible keyboard focus state.

#### Scenario: Visiting Privacy
- **WHEN** the visitor is on `/zh/privacy` or `/en/privacy`
- **THEN** Privacy is identified as the current page in the applicable navigation surface
