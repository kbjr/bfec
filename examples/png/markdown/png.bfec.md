
<!--
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-20T02:57:14.584Z
-->

## $

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L9](../png.bfec#L9)_

The root of a PNG image

https://www.w3.org/TR/PNG

### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>magic_number</code> | <code>"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"</code> | Magic bytes at the start of the file to identify the file as a PNG |
| <code>header</code> | <code><a href="#chunk">Chunk</a>(<a href="#chunktype">ChunkType</a>.IHDR)</code> | The image header is always the first chunk in a PNG image. It contains general metadata like the image dimensions and compression method |
| <code>chunks</code> | <code><a href="#chunk">Chunk</a>[...]</code> |  |

## Chunk

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L18](../png.bfec#L18)_



### Params

| Param Name | Type | Field(s) |
|------------|------|----------|
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> | <code>type</code> |

### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>length</code> | <code>len<u32_be></code> | The length of the `data` field (in bytes) |
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> | Identifies the type of data contained in this chunk |
| <code>data</code> | <code>u8[@.length] -> <a href="#chunkdata">ChunkData</a>(type)</code> | The actual chunk data |
| <code>crc</code> | <code>checksum&lt;u32_be>(@.data, 'crc32')</code> | CRC32 checksum of the `data` field for validation |

## ImageHeader

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L95](../png.bfec#L95)_



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

_Source: [~/png.bfec#L113](../png.bfec#L113)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u8</code> |
| <code>green</code> | <code>u8</code> |
| <code>blue</code> | <code>u8</code> |

## GreyscaleTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L126](../png.bfec#L126)_



### Fields

| Field Name | Type |
|------------|------|
| <code>grey_sample</code> | <code>u16_be</code> |

## TruecolorTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L130](../png.bfec#L130)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red_sample</code> | <code>u16_be</code> |
| <code>green_sample</code> | <code>u16_be</code> |
| <code>blue_sample</code> | <code>u16_be</code> |

## IndexedColorTransparencyData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L136](../png.bfec#L136)_



### Fields

| Field Name | Type |
|------------|------|
| <code>alpha_values</code> | <code>u8[...]</code> |

## PrimaryChromaticitiesAndWhitePointData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L140](../png.bfec#L140)_



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

_Source: [~/png.bfec#L151](../png.bfec#L151)_



### Fields

| Field Name | Type |
|------------|------|
| <code>image_gamma</code> | <code>u32_be</code> |

## EmbeddedICCProfileData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L155](../png.bfec#L155)_



### Fields

| Field Name | Type |
|------------|------|
| <code>proile_name</code> | <code>ascii&lt;null></code> |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |
| <code>compressed_profile</code> | <code>u8[...]</code> |

## GreyscaleSignifigantBitsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L170](../png.bfec#L170)_



### Fields

| Field Name | Type |
|------------|------|
| <code>signifigant_greyscale_bits</code> | <code>u8</code> |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |

## ColorSignifigantBitsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L175](../png.bfec#L175)_



### Fields

| Field Name | Type |
|------------|------|
| <code>signifigant_red_bits</code> | <code>u8</code> |
| <code>signifigant_green_bits</code> | <code>u8</code> |
| <code>signifigant_blue_bits</code> | <code>u8</code> |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |

## RGBColorSpaceData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L189](../png.bfec#L189)_



### Fields

| Field Name | Type |
|------------|------|
| <code>rendering_intent</code> | <code><a href="#rgbrenderingintent">RGBRenderingIntent</a></code> |

## TextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L193](../png.bfec#L193)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii&lt;null></code> |
| <code>text</code> | <code>ascii&lt;...></code> |

## CompressedTextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L198](../png.bfec#L198)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii&lt;null></code> |
| <code>compression_method</code> | <code>u8</code> |
| <code>compressed_text</code> | <code>u8[...]</code> |

## InternationalTextData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L209](../png.bfec#L209)_



### Fields

| Field Name | Type |
|------------|------|
| <code>keyword</code> | <code>ascii&lt;null></code> |
| <code>compression_flag</code> | <code><a href="$remote/https:/bfec.io/bfec/basics/v1.bfec.md#bool">bool</a></code> |
| <code>compression_method</code> | <code>u8</code> |
| <code>language_tag</code> | <code>ascii&lt;null></code> |
| <code>translated_keyword</code> | <code>u8[null]</code> |
| <code>text</code> | <code><a href="#internationaltextdatabody">InternationalTextDataBody</a>(@.compression_flag)</code> |

## GreyscaleBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L227](../png.bfec#L227)_



### Fields

| Field Name | Type |
|------------|------|
| <code>greyscale</code> | <code>u16_be</code> |

## TruecolorBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L231](../png.bfec#L231)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u16_be</code> |
| <code>green</code> | <code>u16_be</code> |
| <code>blue</code> | <code>u16_be</code> |

## IndexedColorBackgroundData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L237](../png.bfec#L237)_



### Fields

| Field Name | Type |
|------------|------|
| <code>pallete_index</code> | <code>u8</code> |

## ImageHistogramData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L241](../png.bfec#L241)_



### Fields

| Field Name | Type |
|------------|------|
| <code>frequencies</code> | <code>u16_be[...]</code> |

## PhysicalPixelDimensionsData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L250](../png.bfec#L250)_



### Fields

| Field Name | Type |
|------------|------|
| <code>ppu_x</code> | <code>u32_be</code> |
| <code>ppu_y</code> | <code>u32_be</code> |
| <code>unit</code> | <code><a href="#pixeldimensionunit">PixelDimensionUnit</a></code> |

## Sample8Bit

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L261](../png.bfec#L261)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u8</code> |
| <code>green</code> | <code>u8</code> |
| <code>blue</code> | <code>u8</code> |
| <code>alpha</code> | <code>u8</code> |

## Sample16Bit

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L268](../png.bfec#L268)_



### Fields

| Field Name | Type |
|------------|------|
| <code>red</code> | <code>u16_be</code> |
| <code>green</code> | <code>u16_be</code> |
| <code>blue</code> | <code>u16_be</code> |
| <code>alpha</code> | <code>u16_be</code> |

## SuggestedPalleteData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L281](../png.bfec#L281)_



### Fields

| Field Name | Type |
|------------|------|
| <code>pallete_name</code> | <code>ascii&lt;null></code> |
| <code>sample_depth</code> | <code><a href="#sampledepth">SampleDepth</a></code> |
| (todo: struct expansion) | <code><a href="#sample">Sample</a>(@.sample_depth)</code> | |
| <code>frequencies</code> | <code>u16_be[...]</code> |

## LastModifiedTimestampData

**Struct** (Byte Aligned)

_Source: [~/png.bfec#L288](../png.bfec#L288)_



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

_Source: [~/png.bfec#L52](../png.bfec#L52)_



### Members

| Case | Value |
|------|-------|
| <code>IHDR</code> | <code><a href="#imageheader">ImageHeader</a></code> |
| <code>PLTE</code> | <code><a href="#pallete">Pallete</a>[...]</code> |
| <code>IDAT</code> | <code><b>void</b></code> |
| <code>IEND</code> | <code><b>void</b></code> |
| <code>tRNS</code> | <code><a href="#transparencydata">TransparencyData</a>($.header.data.color_type)</code> |
| <code>cHRM</code> | <code><a href="#primarychromaticitiesandwhitepointdata">PrimaryChromaticitiesAndWhitePointData</a></code> |
| <code>gAMA</code> | <code><a href="#gammadata">GammaData</a></code> |
| <code>iCCP</code> | <code><a href="#embeddediccprofiledata">EmbeddedICCProfileData</a></code> |
| <code>sBIT</code> | <code><a href="#signifigantbitsdata">SignifigantBitsData</a>($.header.data.color_type)</code> |
| <code>sRGB</code> | <code><a href="#rgbcolorspacedata">RGBColorSpaceData</a></code> |
| <code>tEXt</code> | <code><a href="#textdata">TextData</a></code> |
| <code>xTXt</code> | <code><a href="#compressedtextdata">CompressedTextData</a></code> |
| <code>iTXt</code> | <code><a href="#internationaltextdata">InternationalTextData</a></code> |
| <code>bKGD</code> | <code><a href="#backgroundcolordata">BackgroundColorData</a>($.header.data.color_type)</code> |
| <code>hIST</code> | <code><a href="#imagehistogramdata">ImageHistogramData</a></code> |
| <code>pHYs</code> | <code><a href="#physicalpixeldimensionsdata">PhysicalPixelDimensionsData</a></code> |
| <code>sPLT</code> | <code><a href="#suggestedpalletedata">SuggestedPalleteData</a></code> |
| <code>tIME</code> | <code><a href="#lastmodifiedtimestampdata">LastModifiedTimestampData</a></code> |
| **default** | <code><b>void</b></code> |

## TransparencyData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L119](../png.bfec#L119)_



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

_Source: [~/png.bfec#L161](../png.bfec#L161)_



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

_Source: [~/png.bfec#L204](../png.bfec#L204)_



### Members

| Case | Value |
|------|-------|
| <code>true</code> | <code>u8[...]</code> |
| <code>false</code> | <code>utf8&lt;...></code> |

## BackgroundColorData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L218](../png.bfec#L218)_



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

_Source: [~/png.bfec#L275](../png.bfec#L275)_



### Members

| Case | Value |
|------|-------|
| <code>b8</code> | <code><a href="#sample8bit">Sample8Bit</a></code> |
| <code>b16</code> | <code><a href="#sample16bit">Sample16Bit</a></code> |
| **default** | <code><b>invalid</b></code> |

## ChunkType

**Enum**

**Type:** <code>ascii&lt;4></code>

_Source: [~/png.bfec#L29](../png.bfec#L29)_



### Members

| Name | Value | Comments |
|------|-------|----------|
| <code>IHDR</code> | <code>"IHDR"</code> | Image header |
| <code>PLTE</code> | <code>"PLTE"</code> | Color pallete data |
| <code>IDAT</code> | <code>"IDAT"</code> |  |
| <code>IEND</code> | <code>"IEND"</code> |  |
| <code>tRNS</code> | <code>"tRNS"</code> |  |
| <code>cHRM</code> | <code>"cHRM"</code> |  |
| <code>gAMA</code> | <code>"gAMA"</code> |  |
| <code>iCCP</code> | <code>"iCCP"</code> |  |
| <code>sBIT</code> | <code>"sBIT"</code> |  |
| <code>sRGB</code> | <code>"sRGB"</code> |  |
| <code>tEXt</code> | <code>"tEXt"</code> |  |
| <code>xTXt</code> | <code>"xTXt"</code> |  |
| <code>iTXt</code> | <code>"iTXt"</code> |  |
| <code>bKGD</code> | <code>"bKGD"</code> |  |
| <code>hIST</code> | <code>"hIST"</code> |  |
| <code>pHYs</code> | <code>"pHYs"</code> |  |
| <code>sPLT</code> | <code>"sPLT"</code> |  |
| <code>tIME</code> | <code>"tIME"</code> |  |

## BitDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L74](../png.bfec#L74)_



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

_Source: [~/png.bfec#L82](../png.bfec#L82)_



### Members

| Name | Value |
|------|-------|
| <code>zlib</code> | <code>0</code> |

## FilterMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L86](../png.bfec#L86)_



### Members

| Name | Value |
|------|-------|
| <code>adaptive</code> | <code>0</code> |

## InterlaceMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L90](../png.bfec#L90)_



### Members

| Name | Value |
|------|-------|
| <code>no_interlace</code> | <code>0</code> |
| <code>adam7_interlace</code> | <code>1</code> |

## ColorType

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L105](../png.bfec#L105)_



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

_Source: [~/png.bfec#L182](../png.bfec#L182)_



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

_Source: [~/png.bfec#L245](../png.bfec#L245)_



### Members

| Name | Value |
|------|-------|
| <code>unknown</code> | <code>0</code> |
| <code>meter</code> | <code>1</code> |

## SampleDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L256](../png.bfec#L256)_



### Members

| Name | Value |
|------|-------|
| <code>b8</code> | <code>8</code> |
| <code>b16</code> | <code>16</code> |
