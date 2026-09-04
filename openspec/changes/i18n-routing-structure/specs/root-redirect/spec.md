## Purpose

Route unqualified entry requests to a canonical language URL while respecting supported browser preferences and providing a deterministic fallback.

## ADDED Requirements

### Requirement: Root selects a supported language
Requests to `/` SHALL redirect to `/zh` when the request's most preferred supported language is Chinese and SHALL redirect to `/en` otherwise.

#### Scenario: Chinese is preferred
- **WHEN** `/` is requested with an `Accept-Language` preference that selects Chinese over English
- **THEN** the response redirects to `/zh`

#### Scenario: No supported preference exists
- **WHEN** `/` is requested without a supported language preference
- **THEN** the response redirects to `/en`

### Requirement: Redirect responses are cache-safe
Language-negotiated redirects SHALL declare that their response varies by `Accept-Language` and SHALL NOT be cached as a universal redirect for all visitors.

#### Scenario: Inspecting a root redirect
- **WHEN** the root redirect response is returned
- **THEN** its headers prevent one visitor's negotiated locale from being reused for visitors with different language preferences
