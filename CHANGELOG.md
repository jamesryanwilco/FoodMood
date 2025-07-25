# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Your new feature here.

### Changed
- Your changed feature here.

### Fixed
- Your fixed bug here.

---

## [1.2.0] - 2025-07-25

### Added
- **Interactive Goal Management:** Implemented drag-and-drop reordering for the goals list on the "View Goals" screen.
- **Swipe-to-Delete:** Added swipe-to-delete functionality for goals on the "View Goals" screen, with an improved delete button that includes a trash icon.
- **Multiple Custom Goals:** Users can now add, view, and delete multiple custom-written intentions on the "Select Goals" screen.

### Changed
- **Streamlined Goal Navigation:** Removed the intermediate "Goals" landing page. The "Goals" tab now navigates directly to the user's list of current intentions (`ViewGoalsScreen`).
- **Improved "Select Goals" UI:** The "Select Goals" page has been redesigned with a fixed header and no longer uses collapsible sections, making all goal options immediately visible.
- **Fixed Layout on "View Goals" Screen:** The "View Goals" screen now has a fixed header and footer, with only the list of goals being scrollable.

### Fixed
- **Keyboard Handling:** The text input on the "Select Goals" screen now moves into view when the keyboard is open, preventing it from being obscured.
- **Data Compatibility:** Fixed a crash on the goals pages caused by an older data format. The app now gracefully handles both old and new data structures for custom goals. 