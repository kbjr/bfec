
<!--
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-13T03:29:24.851Z
-->

## $

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L8](../png.bfec#L8)_

PNG Image Format

https://www.w3.org/TR/PNG

### Fields

| Field Name | Type |
|------------|------|
| <code>magic_number</code> | <code>"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"</code> |
| <code>header</code> | <code><a href="#chunk">Chunk</a></code> |
| <code>chunks</code> | <code><a href="#chunk">Chunk</a>[...]</code> |

## Chunk

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L14](../png.bfec#L14)_



### Params

| Param Name | Type | Field(s) |
|------------|------|----------|
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> | <code>type</code> |

### Fields

| Field Name | Type |
|------------|------|
| <code>length</code> | <code>len<u32_be></code> |
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> |
| <code>data</code> | <code>u8[(todo: length field)] -> <a href="#chunkdata">ChunkData(todo: switch param)</a></code> |
| <code>crc</code> | <code>checksum<u32_be>(@.data, 'crc32')</code> |

## ImageHeader

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L85](../png.bfec#L85)_



### Fields

| Field Name | Type |
|------------|------|
| <code>width</code> | <code>u32_be</code> |
| <code>height</code> | <code>u32_be</code> |
| <code>bit_depth</code> | <code><a href="#bitdepth">BitDepth</a></code> |
| <code>color_type</code> | <code><a href="#colortype">ColorType</a></code> |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |
| <code>filter_method</code> | <code><a href="#filtermethod">FilterMethod</a></code> |
| <code>interlace_method</code> | <code><a href="#interlacemethod">InterlaceMethod</a></code> |

## Pallete

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L103](../png.bfec#L103)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u8</code> |
| <code>green</code> | <code>u8</code> |
| <code>blue</code> | <code>u8</code> |

## GreyscaleTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L116](../png.bfec#L116)_



### Fields

| Field Name | Type |
|------------|------|
| <code>grey_sample</code> | <code>u16_be</code> |

## TruecolorTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L120](../png.bfec#L120)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red_sample</code> | <code>u16_be</code> |
| <code>green_sample</code> | <code>u16_be</code> |
| <code>blue_sample</code> | <code>u16_be</code> |

## IndexedColorTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L126](../png.bfec#L126)_



### Fields

| Field Name | Type |
|------------|------|
| <code>alpha_values</code> | <code>u8[...]</code> |

## PrimaryChromaticitiesAndWhitePointData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L130](../png.bfec#L130)_



### Fields

| Field Name | Type |
|------------|------|
| <code>white_point_x</code> | <code>u32_be</code> |
| <code>white_point_y</code> | <code>u32_be</code> |
| <code>red_x</code> | <code>u32_be</code> |
| <code>red_y</code> | <code>u32_be</code> |
| <code>green_x</code> | <code>u32_be</code> |
| <code>green_y</code> | <code>u32_be</code> |
| <code>blue_x</code> | <code>u32_be</code> |
| <code>blue_y</code> | <code>u32_be</code> |

## GammaData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L141](../png.bfec#L141)_



### Fields

| Field Name | Type |
|------------|------|
| <code>image_gamma</code> | <code>u32_be</code> |

## EmbeddedICCProfileData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L145](../png.bfec#L145)_



### Fields

| Field Name | Type |
|------------|------|
| <code>proile_name</code> | <code>ascii<null></code> |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |
| <code>compressed_profile</code> | <code>u8[...]</code> |

## GreyscaleSignifigantBitsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L160](../png.bfec#L160)_



### Fields

| Field Name | Type |
|------------|------|
| <code>signifigant_greyscale_bits</code> | <code>u8</code> |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |

## ColorSignifigantBitsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L165](../png.bfec#L165)_



### Fields

| Field Name | Type |
|------------|------|
| <code>signifigant_red_bits</code> | <code>u8</code> |
| <code>signifigant_green_bits</code> | <code>u8</code> |
| <code>signifigant_blue_bits</code> | <code>u8</code> |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |

## RGBColorSpaceData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L179](../png.bfec#L179)_



### Fields

| Field Name | Type |
|------------|------|
| <code>rendering_intent</code> | <code><a href="#rgbrenderingintent">RGBRenderingIntent</a></code> |

## TextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L183](../png.bfec#L183)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii<null></code> |
| <code>text</code> | <code>ascii<...></code> |

## CompressedTextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L188](../png.bfec#L188)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii<null></code> |
| <code>compression_method</code> | <code>u8</code> |
| <code>compressed_text</code> | <code>u8[...]</code> |

## InternationalTextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L199](../png.bfec#L199)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii<null></code> |
| <code>compression_flag</code> | <code><a href="$remote/https:/bfec.io/bfec/basics/v1.bfec.md#bool">bool</a></code> |
| <code>compression_method</code> | <code>u8</code> |
| <code>language_tag</code> | <code>ascii<null></code> |
| <code>translated_keyword</code> | <code>u8[null]</code> |
| <code>text</code> | <code><a href="#internationaltextdatabody">InternationalTextDataBody(todo: switch param)</a></code> |

## GreyscaleBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L217](../png.bfec#L217)_



### Fields

| Field Name | Type |
|------------|------|
| <code>greyscale</code> | <code>u16_be</code> |

## TruecolorBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L221](../png.bfec#L221)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u16_be</code> |
| <code>green</code> | <code>u16_be</code> |
| <code>blue</code> | <code>u16_be</code> |

## IndexedColorBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L227](../png.bfec#L227)_



### Fields

| Field Name | Type |
|------------|------|
| <code>pallete_index</code> | <code>u8</code> |

## ImageHistogramData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L231](../png.bfec#L231)_



### Fields

| Field Name | Type |
|------------|------|
| <code>frequencies</code> | <code>u16_be[...]</code> |

## PhysicalPixelDimensionsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L240](../png.bfec#L240)_



### Fields

| Field Name | Type |
|------------|------|
| <code>ppu_x</code> | <code>u32_be</code> |
| <code>ppu_y</code> | <code>u32_be</code> |
| <code>unit</code> | <code><a href="#pixeldimensionunit">PixelDimensionUnit</a></code> |

## Sample8Bit

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L251](../png.bfec#L251)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u8</code> |
| <code>green</code> | <code>u8</code> |
| <code>blue</code> | <code>u8</code> |
| <code>alpha</code> | <code>u8</code> |

## Sample16Bit

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L258](../png.bfec#L258)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u16_be</code> |
| <code>green</code> | <code>u16_be</code> |
| <code>blue</code> | <code>u16_be</code> |
| <code>alpha</code> | <code>u16_be</code> |

## SuggestedPalleteData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L271](../png.bfec#L271)_



### Fields

| Field Name | Type |
|------------|------|
| <code>pallete_name</code> | <code>ascii<null></code> |
| <code>sample_depth</code> | <code><a href="#sampledepth">SampleDepth</a></code> |
| (todo: struct expansion) | <code><a href="#sample">Sample(todo: switch param)</a></code> | |
| <code>frequencies</code> | <code>u16_be[...]</code> |

## LastModifiedTimestampData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L278](../png.bfec#L278)_



### Fields

| Field Name | Type |
|------------|------|
| <code>year</code> | <code>u16_be</code> |
| <code>month</code> | <code>u8</code> |
| <code>day</code> | <code>u8</code> |
| <code>hour</code> | <code>u8</code> |
| <code>minute</code> | <code>u8</code> |
| <code>second</code> | <code>u8</code> |

## ChunkData

**Switch**

**Type:** <code><a href="#chunktype">ChunkType</a></code>

_Source: [~/png.bfec#L42](../png.bfec#L42)_



### Members

| Case | Value |
|------|-------|
| <code>IHDR</code> | <code><a href="#imageheader">ImageHeader</a></code> |
| <code>PLTE</code> | <code><a href="#pallete">Pallete</a>[...]</code> |
| <code>IDAT</code> | <code><b>void</b></code> |
| <code>IEND</code> | <code><b>void</b></code> |
| <code>tRNS</code> | <code><a href="#transparencydata">TransparencyData(todo: switch param)</a></code> |
| <code>cHRM</code> | <code><a href="#primarychromaticitiesandwhitepointdata">PrimaryChromaticitiesAndWhitePointData</a></code> |
| <code>gAMA</code> | <code><a href="#gammadata">GammaData</a></code> |
| <code>iCCP</code> | <code><a href="#embeddediccprofiledata">EmbeddedICCProfileData</a></code> |
| <code>sBIT</code> | <code><a href="#signifigantbitsdata">SignifigantBitsData(todo: switch param)</a></code> |
| <code>sRGB</code> | <code><a href="#rgbcolorspacedata">RGBColorSpaceData</a></code> |
| <code>tEXt</code> | <code><a href="#textdata">TextData</a></code> |
| <code>xTXt</code> | <code><a href="#compressedtextdata">CompressedTextData</a></code> |
| <code>iTXt</code> | <code><a href="#internationaltextdata">InternationalTextData</a></code> |
| <code>bKGD</code> | <code><a href="#backgroundcolordata">BackgroundColorData(todo: switch param)</a></code> |
| <code>hIST</code> | <code><a href="#imagehistogramdata">ImageHistogramData</a></code> |
| <code>pHYs</code> | <code><a href="#physicalpixeldimensionsdata">PhysicalPixelDimensionsData</a></code> |
| <code>sPLT</code> | <code><a href="#suggestedpalletedata">SuggestedPalleteData</a></code> |
| <code>tIME</code> | <code><a href="#lastmodifiedtimestampdata">LastModifiedTimestampData</a></code> |
| **default** | <code><b>void</b></code> |
## TransparencyData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L109](../png.bfec#L109)_



### Members

| Case | Value |
|------|-------|
| <code>greyscale</code> | <code><a href="#greyscaletransparencydata">GreyscaleTransparencyData</a></code> |
| <code>truecolor</code> | <code><a href="#truecolortransparencydata">TruecolorTransparencyData</a></code> |
| <code>indexed_color</code> | <code><a href="#indexedcolortransparencydata">IndexedColorTransparencyData</a></code> |
| **default** | <code><b>invalid</b></code> |
## SignifigantBitsData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L151](../png.bfec#L151)_



### Members

| Case | Value |
|------|-------|
| <code>greyscale</code> | <code><a href="#greyscalesignifigantbitsdata">GreyscaleSignifigantBitsData</a></code> |
| <code>truecolor</code> | <code><a href="#colorsignifigantbitsdata">ColorSignifigantBitsData</a></code> |
| <code>indexed_color</code> | <code><a href="#colorsignifigantbitsdata">ColorSignifigantBitsData</a></code> |
| <code>greyscale_with_alpha</code> | <code><a href="#greyscalesignifigantbitsdata">GreyscaleSignifigantBitsData</a></code> |
| <code>truecolor_with_alpha</code> | <code><a href="#colorsignifigantbitsdata">ColorSignifigantBitsData</a></code> |
| **default** | <code><b>invalid</b></code> |
## InternationalTextDataBody

**Switch**

**Type:** <code><a href="$remote/https:/bfec.io/bfec/basics/v1.bfec.md#bool">bool</a></code>

_Source: [~/png.bfec#L194](../png.bfec#L194)_



### Members

| Case | Value |
|------|-------|
| <code>true</code> | <code>u8[...]</code> |
| <code>false</code> | <code>utf8<...></code> |
## BackgroundColorData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L208](../png.bfec#L208)_



### Members

| Case | Value |
|------|-------|
| <code>greyscale</code> | <code><a href="#greyscalebackgrounddata">GreyscaleBackgroundData</a></code> |
| <code>greyscale_with_alpha</code> | <code><a href="#greyscalebackgrounddata">GreyscaleBackgroundData</a></code> |
| <code>truecolor</code> | <code><a href="#truecolorbackgrounddata">TruecolorBackgroundData</a></code> |
| <code>truecolor_with_alpha</code> | <code><a href="#truecolorbackgrounddata">TruecolorBackgroundData</a></code> |
| <code>indexed_color</code> | <code><a href="#indexedcolorbackgrounddata">IndexedColorBackgroundData</a></code> |
| **default** | <code><b>invalid</b></code> |
## Sample

**Switch**

**Type:** <code><a href="#sampledepth">SampleDepth</a></code>

_Source: [~/png.bfec#L265](../png.bfec#L265)_



### Members

| Case | Value |
|------|-------|
| <code>b8</code> | <code><a href="#sample8bit">Sample8Bit</a></code> |
| <code>b16</code> | <code><a href="#sample16bit">Sample16Bit</a></code> |
| **default** | <code><b>invalid</b></code> |
## ChunkType

**Enum**

**Type:** <code>ascii<4></code>

_Source: [~/png.bfec#L21](../png.bfec#L21)_



### Members

| Name | Value |
|------|-------|
| <code>IHDR</code> | <code>IHDR</code> |
| <code>PLTE</code> | <code>PLTE</code> |
| <code>IDAT</code> | <code>IDAT</code> |
| <code>IEND</code> | <code>IEND</code> |
| <code>tRNS</code> | <code>tRNS</code> |
| <code>cHRM</code> | <code>cHRM</code> |
| <code>gAMA</code> | <code>gAMA</code> |
| <code>iCCP</code> | <code>iCCP</code> |
| <code>sBIT</code> | <code>sBIT</code> |
| <code>sRGB</code> | <code>sRGB</code> |
| <code>tEXt</code> | <code>tEXt</code> |
| <code>xTXt</code> | <code>xTXt</code> |
| <code>iTXt</code> | <code>iTXt</code> |
| <code>bKGD</code> | <code>bKGD</code> |
| <code>hIST</code> | <code>hIST</code> |
| <code>pHYs</code> | <code>pHYs</code> |
| <code>sPLT</code> | <code>sPLT</code> |
| <code>tIME</code> | <code>tIME</code> |
## BitDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L64](../png.bfec#L64)_



### Members

| Name | Value |
|------|-------|
| <code>b1</code> | <code>1</code> |
| <code>b2</code> | <code>2</code> |
| <code>b4</code> | <code>4</code> |
| <code>b8</code> | <code>8</code> |
| <code>b16</code> | <code>16</code> |
## CompressionMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L72](../png.bfec#L72)_



### Members

| Name | Value |
|------|-------|
| <code>zlib</code> | <code>0</code> |
## FilterMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L76](../png.bfec#L76)_



### Members

| Name | Value |
|------|-------|
| <code>adaptive</code> | <code>0</code> |
## InterlaceMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L80](../png.bfec#L80)_



### Members

| Name | Value |
|------|-------|
| <code>no_interlace</code> | <code>0</code> |
| <code>adam7_interlace</code> | <code>1</code> |
## ColorType

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L95](../png.bfec#L95)_



### Members

| Name | Value |
|------|-------|
| <code>greyscale</code> | <code>0</code> |
| <code>truecolor</code> | <code>2</code> |
| <code>indexed_color</code> | <code>3</code> |
| <code>greyscale_with_alpha</code> | <code>4</code> |
| <code>truecolor_with_alpha</code> | <code>6</code> |
## RGBRenderingIntent

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L172](../png.bfec#L172)_



### Members

| Name | Value |
|------|-------|
| <code>perceptual</code> | <code>0</code> |
| <code>relative_colorimetric</code> | <code>1</code> |
| <code>saturation</code> | <code>2</code> |
| <code>absolute_colorimetric</code> | <code>3</code> |
## PixelDimensionUnit

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L235](../png.bfec#L235)_



### Members

| Name | Value |
|------|-------|
| <code>unknown</code> | <code>0</code> |
| <code>meter</code> | <code>1</code> |
## SampleDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L246](../png.bfec#L246)_



### Members

| Name | Value |
|------|-------|
| <code>b8</code> | <code>8</code> |
| <code>b16</code> | <code>16</code> |