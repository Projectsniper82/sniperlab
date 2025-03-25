# Changelog

<a name="0.4.0"></a>

## [0.4.0](https://github.com/jpcx/ts-ev/tree/0.4.0) (2022-03-13)

| __[Changes since 0.3.0](https://github.com/jpcx/ts-ev/compare/0.3.0...0.4.0)__ | [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.4.0) | [README](https://github.com/jpcx/ts-ev/tree/0.4.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.4.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.4.0.tar.gz) |
| --- | --- |

### Changed

- Clarified inheritance summary in the README.
- Updated all dependencies to latest versions.

### Fixed

- `DataFilter` type assertion fix.

<a name="0.3.0"></a>

## [0.3.0](https://github.com/jpcx/ts-ev/tree/0.3.0) (2021-09-15)

| __[Changes since 0.2.2](https://github.com/jpcx/ts-ev/compare/0.2.2...0.3.0)__ | [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.3.0) | [README](https://github.com/jpcx/ts-ev/tree/0.3.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.3.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.3.0.tar.gz) |
| --- | --- |

### Changed

- Simplified filter type narrowing for clarity.
  - Filter must now specify both the input and output types:
    e.g. `(args: [number, string]): args is [1, "foo"] => args[0] === 1 && args[1] === "foo"`

<a name="0.2.2"></a>

## [0.2.2](https://github.com/jpcx/ts-ev/tree/0.2.2) (2021-09-15)

| __[Changes since 0.2.1](https://github.com/jpcx/ts-ev/compare/0.2.1...0.2.2)__ | [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.2.2) | [README](https://github.com/jpcx/ts-ev/tree/0.2.2/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.2.2.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.2.2.tar.gz) |
| --- | --- |

### Fixed

- More variable name consistency.
- Changelog and README edits.
- `.off()`: Data tparam.

<a name="0.2.1"></a>

## [0.2.1](https://github.com/jpcx/ts-ev/tree/0.2.1) (2021-09-15)

| __[Changes since 0.2.0](https://github.com/jpcx/ts-ev/compare/0.2.0...0.2.1)__ | [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.2.1) | [README](https://github.com/jpcx/ts-ev/tree/0.2.1/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.2.1.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.2.1.tar.gz) |
| --- | --- |

### Fixed

- Variable name consistency.

<a name="0.2.0"></a>

## [0.2.0](https://github.com/jpcx/ts-ev/tree/0.2.0) (2021-09-15)

| __[Changes since 0.1.0](https://github.com/jpcx/ts-ev/compare/0.1.0...0.2.0)__ | [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.2.0) | [README](https://github.com/jpcx/ts-ev/tree/0.2.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.2.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.2.0.tar.gz) |
| --- | --- |

### Changed

- Minor changes to the README.

<a name="0.1.0"></a>

## [0.1.0](https://github.com/jpcx/ts-ev/tree/0.1.0) (2021-09-15)

| [Release Notes](https://github.com/jpcx/ts-ev/releases/tag/0.1.0) | [README](https://github.com/jpcx/ts-ev/tree/0.1.0/README.md) |
| --- | --- |

| [Source Code (zip)](https://github.com/jpcx/ts-ev/archive/0.1.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/ts-ev/archive/0.1.0.tar.gz) |
| --- | --- |

### Added

- First Release!
