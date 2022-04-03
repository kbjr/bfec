# Structs

## `$`

### Fields

#### `magic_number`

#### `image_header`

#### `chunks`

> _Defined in [~/png.bfec](png.bfec.md)_

## `Chunk`

### Fields

#### `length`

#### `type`

#### `data`

#### `crc`

> _Defined in [~/png.bfec](png.bfec.md)_

## `ImageHeader`

### Fields

#### `width`

#### `height`

#### `bit_depth`

#### `color_type`

#### `compression_method`

#### `filter_method`

#### `interlace_method`

> _Defined in [~/png.bfec](png.bfec.md)_

## `Pallete`

### Fields

#### `red`

#### `green`

#### `blue`

> _Defined in [~/png.bfec](png.bfec.md)_

## `GreyscaleTransparencyData`

### Fields

#### `grey_sample`

> _Defined in [~/png.bfec](png.bfec.md)_

## `TruecolorTransparencyData`

### Fields

#### `red_sample`

#### `green_sample`

#### `blue_sample`

> _Defined in [~/png.bfec](png.bfec.md)_

## `IndexedColorTransparencyData`

### Fields

#### `alpha_values`

> _Defined in [~/png.bfec](png.bfec.md)_

## `PrimaryChromaticitiesAndWhitePointData`

### Fields

#### `white_point_x`

#### `white_point_y`

#### `red_x`

#### `red_y`

#### `green_x`

#### `green_y`

#### `blue_x`

#### `blue_y`

> _Defined in [~/png.bfec](png.bfec.md)_

## `GammaData`

### Fields

#### `image_gamma`

> _Defined in [~/png.bfec](png.bfec.md)_

## `EmbeddedICCProfileData`

### Fields

#### `proile_name`

#### `compression_method`

#### `compressed_profile`

> _Defined in [~/png.bfec](png.bfec.md)_

## `GreyscaleSignifigantBitsData`

### Fields

#### `signifigant_greyscale_bits`

#### `signifigant_alpha_bits`

> _Defined in [~/png.bfec](png.bfec.md)_

## `ColorSignifigantBitsData`

### Fields

#### `signifigant_red_bits`

#### `signifigant_green_bits`

#### `signifigant_blue_bits`

#### `signifigant_alpha_bits`

> _Defined in [~/png.bfec](png.bfec.md)_

## `RGBColorSpaceData`

### Fields

#### `rendering_intent`

> _Defined in [~/png.bfec](png.bfec.md)_

## `TextData`

### Fields

#### `keyword`

#### `text`

> _Defined in [~/png.bfec](png.bfec.md)_

## `CompressedTextData`

### Fields

#### `keyword`

#### `compression_method`

#### `compressed_text`

> _Defined in [~/png.bfec](png.bfec.md)_

## `InternationalTextData`

### Fields

#### `keyword`

#### `compression_flag`

#### `compression_method`

#### `language_tag`

#### `translated_keyword`

#### `text`

> _Defined in [~/png.bfec](png.bfec.md)_

## `GreyscaleBackgroundData`

### Fields

#### `greyscale`

> _Defined in [~/png.bfec](png.bfec.md)_

## `TruecolorBackgroundData`

### Fields

#### `red`

#### `green`

#### `blue`

> _Defined in [~/png.bfec](png.bfec.md)_

## `IndexedColorBackgroundData`

### Fields

#### `pallete_index`

> _Defined in [~/png.bfec](png.bfec.md)_

## `ImageHistogramData`

### Fields

#### `frequencies`

> _Defined in [~/png.bfec](png.bfec.md)_

## `PhysicalPixelDimensionsData`

### Fields

#### `ppu_x`

#### `ppu_y`

#### `unit`

> _Defined in [~/png.bfec](png.bfec.md)_

## `Sample8Bit`

### Fields

#### `red`

#### `green`

#### `blue`

#### `alpha`

> _Defined in [~/png.bfec](png.bfec.md)_

## `Sample16Bit`

### Fields

#### `red`

#### `green`

#### `blue`

#### `alpha`

> _Defined in [~/png.bfec](png.bfec.md)_

## `SuggestedPalleteData`

### Fields

#### `pallete_name`

#### `sample_depth`

#### `frequencies`

> _Defined in [~/png.bfec](png.bfec.md)_

## `LastModifiedTimestampData`

### Fields

#### `year`

#### `month`

#### `day`

#### `hour`

#### `minute`

#### `second`

> _Defined in [~/png.bfec](png.bfec.md)_
