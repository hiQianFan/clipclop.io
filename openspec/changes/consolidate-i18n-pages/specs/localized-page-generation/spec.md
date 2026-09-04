## Purpose

Ensure every localized public page is generated from consistent structure and content while language navigation remains reliable without client-side routing code.

## ADDED Requirements

### Requirement: Localized variants share page structure
The site SHALL publish Chinese and English variants of each public page from a shared page structure, with complete localized initial HTML and metadata.

#### Scenario: Building localized pages
- **WHEN** the production site is built
- **THEN** equivalent Chinese and English routes contain the same structural elements with locale-specific content and metadata

### Requirement: Language choices are navigable destinations
Each language choice SHALL be a normal link to the equivalent route in that language and SHALL NOT require JavaScript to navigate.

#### Scenario: Opening the language control
- **WHEN** a visitor activates the language control without choosing a language
- **THEN** the current URL and language remain unchanged while the available languages are exposed

#### Scenario: Choosing another language
- **WHEN** a visitor follows another language from a localized page
- **THEN** the equivalent localized route loads while preserving the page suffix, query, and fragment

### Requirement: Fixed localized copy has one source
Fixed page content and its SEO metadata SHALL be sourced from the same locale data used during static generation.

#### Scenario: Updating localized copy
- **WHEN** a localized content value is changed and the site is rebuilt
- **THEN** the generated page and its applicable metadata use the updated value without a second browser-side translation copy
