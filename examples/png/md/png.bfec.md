# Structs

## `$`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_

PNG Image Format
https://www.w3.org/TR/PNG

| Field Name | Type | Comments |
|------------|------|----------|
| `magic_number` | `"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"` | Magic bytes to identify the PNG file format |
| `header` | [foo](./bar) | Image header should always be the first chunk, and we need to reference data out of it, so we'll statically define it here so we can `$.header` elsewhere |
| `chunks` | [foo](./bar) | The rest of the file we'll just read as a big list of chunks |
## `Chunk`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `length` | `len<u32_be>` |  |
| `type` | [foo](./bar) |  |
| `data` | [foo](./bar) |  |
| `crc` | [foo](./bar) |  |
## `ImageHeader`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `width` | `u32_be` |  |
| `height` | `u32_be` |  |
| `bit_depth` | [foo](./bar) |  |
| `color_type` | [foo](./bar) |  |
| `compression_method` | [foo](./bar) |  |
| `filter_method` | [foo](./bar) |  |
| `interlace_method` | [foo](./bar) |  |
## `Pallete`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `red` | `u8` |  |
| `green` | `u8` |  |
| `blue` | `u8` |  |
## `GreyscaleTransparencyData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `grey_sample` | `u16_be` |  |
## `TruecolorTransparencyData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `red_sample` | `u16_be` |  |
| `green_sample` | `u16_be` |  |
| `blue_sample` | `u16_be` |  |
## `IndexedColorTransparencyData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `alpha_values` | [foo](./bar) |  |
## `PrimaryChromaticitiesAndWhitePointData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `white_point_x` | `u32_be` |  |
| `white_point_y` | `u32_be` |  |
| `red_x` | `u32_be` |  |
| `red_y` | `u32_be` |  |
| `green_x` | `u32_be` |  |
| `green_y` | `u32_be` |  |
| `blue_x` | `u32_be` |  |
| `blue_y` | `u32_be` |  |
## `GammaData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `image_gamma` | `u32_be` |  |
## `EmbeddedICCProfileData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `proile_name` | [foo](./bar) |  |
| `compression_method` | [foo](./bar) |  |
| `compressed_profile` | [foo](./bar) |  |
## `GreyscaleSignifigantBitsData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `signifigant_greyscale_bits` | `u8` |  |
| `signifigant_alpha_bits` | `u8` |  |
## `ColorSignifigantBitsData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `signifigant_red_bits` | `u8` |  |
| `signifigant_green_bits` | `u8` |  |
| `signifigant_blue_bits` | `u8` |  |
| `signifigant_alpha_bits` | `u8` |  |
## `RGBColorSpaceData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `rendering_intent` | [foo](./bar) |  |
## `TextData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `keyword` | [foo](./bar) |  |
| `text` | [foo](./bar) |  |
## `CompressedTextData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `keyword` | [foo](./bar) |  |
| `compression_method` | `u8` |  |
| `compressed_text` | [foo](./bar) |  |
## `InternationalTextData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `keyword` | [foo](./bar) |  |
| `compression_flag` | [foo](./bar) |  |
| `compression_method` | `u8` |  |
| `language_tag` | [foo](./bar) |  |
| `translated_keyword` | [foo](./bar) |  |
| `text` | [foo](./bar) |  |
## `GreyscaleBackgroundData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `greyscale` | `u16_be` |  |
## `TruecolorBackgroundData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `red` | `u16_be` |  |
| `green` | `u16_be` |  |
| `blue` | `u16_be` |  |
## `IndexedColorBackgroundData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `pallete_index` | `u8` |  |
## `ImageHistogramData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `frequencies` | [foo](./bar) |  |
## `PhysicalPixelDimensionsData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `ppu_x` | `u32_be` |  |
| `ppu_y` | `u32_be` |  |
| `unit` | [foo](./bar) |  |
## `Sample8Bit`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `red` | `u8` |  |
| `green` | `u8` |  |
| `blue` | `u8` |  |
| `alpha` | `u8` |  |
## `Sample16Bit`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `red` | `u16_be` |  |
| `green` | `u16_be` |  |
| `blue` | `u16_be` |  |
| `alpha` | `u16_be` |  |
## `SuggestedPalleteData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `pallete_name` | [foo](./bar) |  |
| `sample_depth` | [foo](./bar) |  |
| `frequencies` | [foo](./bar) | sample: Sample(@.sample_depth); |
## `LastModifiedTimestampData`

_Source: [~/png.bfec](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec)_



| Field Name | Type | Comments |
|------------|------|----------|
| `year` | `u16_be` |  |
| `month` | `u8` |  |
| `day` | `u8` |  |
| `hour` | `u8` |  |
| `minute` | `u8` |  |
| `second` | `u8` |  |