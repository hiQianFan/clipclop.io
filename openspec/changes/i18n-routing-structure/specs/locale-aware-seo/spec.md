## Purpose

Expose complete language-specific metadata and alternate relationships so search engines can index each localized page under its canonical public URL.

## ADDED Requirements

### Requirement: Document language matches route language
Every localized page SHALL set `html lang` to `zh-CN` for `/zh/*` and `en` for `/en/*`.

#### Scenario: Loading Chinese Home
- **WHEN** `/zh` is rendered
- **THEN** the document language is `zh-CN`

### Requirement: Metadata is localized
Every localized page SHALL provide language-appropriate title, description, Open Graph metadata, and Twitter Card metadata.

#### Scenario: Indexing English Download
- **WHEN** a crawler loads `/en/download`
- **THEN** the response contains English metadata describing the Download page

### Requirement: Language alternatives are declared
Every localized page SHALL identify its Chinese and English equivalents with `hreflang` links and SHALL identify the English equivalent as `x-default`.

#### Scenario: Inspecting alternate links
- **WHEN** a crawler loads `/zh/privacy`
- **THEN** alternate links identify `/zh/privacy` as `zh-CN`, `/en/privacy` as `en`, and `/en/privacy` as `x-default`

### Requirement: Each localized page is canonical
Every localized page SHALL declare its own absolute language-prefixed URL as canonical.

#### Scenario: Inspecting English canonical metadata
- **WHEN** a crawler loads `/en/changelog`
- **THEN** its canonical URL is `https://clipclop.io/en/changelog`
