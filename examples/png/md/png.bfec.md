<!-- THIS FILE WAS AUTOMATICALLY GENERATED -->

## $

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L9](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L9)_

PNG Image Format

https://www.w3.org/TR/PNG

### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>magic_number</code> | <code>"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"</code> | Magic bytes to identify the PNG file format |
| <code>header</code> | <code><a href="#chunk">Chunk</a></code> | Image header should always be the first chunk, and we need to reference data out of it, so we'll statically define it here so we can `$.header` elsewhere |
| <code>chunks</code> | <code><a href="#chunk">Chunk</a>[...]</code> | The rest of the file we'll just read as a big list of chunks |
## Chunk

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L21](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L21)_



### Params

| Param Name | Type | Field(s) |
|------------|------|----------|
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> | <code>type</code> |
### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>length</code> | <code>len<u32_be></code> |  |
| <code>type</code> | <code><a href="#chunktype">ChunkType</a></code> |  |
| <code>data</code> | <code>u8[(todo: length field)] -> <a href="#chunkdata">ChunkData</a></code> |  |
| <code>crc</code> | <code>checksum</code> |  |
## ImageHeader

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L92](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L92)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>width</code> | <code>u32_be</code> |  |
| <code>height</code> | <code>u32_be</code> |  |
| <code>bit_depth</code> | <code><a href="#bitdepth">BitDepth</a></code> |  |
| <code>color_type</code> | <code><a href="#colortype">ColorType</a></code> |  |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |  |
| <code>filter_method</code> | <code><a href="#filtermethod">FilterMethod</a></code> |  |
| <code>interlace_method</code> | <code><a href="#interlacemethod">InterlaceMethod</a></code> |  |
## Pallete

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L110](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L110)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
## GreyscaleTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L123](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L123)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>grey_sample</code> | <code>u16_be</code> |  |
## TruecolorTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L127](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L127)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red_sample</code> | <code>u16_be</code> |  |
| <code>green_sample</code> | <code>u16_be</code> |  |
| <code>blue_sample</code> | <code>u16_be</code> |  |
## IndexedColorTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L133](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L133)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>alpha_values</code> | <code>u8[...]</code> |  |
## PrimaryChromaticitiesAndWhitePointData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L137](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L137)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>white_point_x</code> | <code>u32_be</code> |  |
| <code>white_point_y</code> | <code>u32_be</code> |  |
| <code>red_x</code> | <code>u32_be</code> |  |
| <code>red_y</code> | <code>u32_be</code> |  |
| <code>green_x</code> | <code>u32_be</code> |  |
| <code>green_y</code> | <code>u32_be</code> |  |
| <code>blue_x</code> | <code>u32_be</code> |  |
| <code>blue_y</code> | <code>u32_be</code> |  |
## GammaData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L148](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L148)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>image_gamma</code> | <code>u32_be</code> |  |
## EmbeddedICCProfileData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L152](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L152)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>proile_name</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |  |
| <code>compressed_profile</code> | <code>u8[...]</code> |  |
## GreyscaleSignifigantBitsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L167](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L167)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_greyscale_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
## ColorSignifigantBitsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L172](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L172)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_red_bits</code> | <code>u8</code> |  |
| <code>signifigant_green_bits</code> | <code>u8</code> |  |
| <code>signifigant_blue_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
## RGBColorSpaceData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L186](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L186)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>rendering_intent</code> | <code><a href="#rgbrenderingintent">RGBRenderingIntent</a></code> |  |
## TextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L190](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L190)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>text</code> | <code>ascii<...></code> |  |
## CompressedTextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L195](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L195)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code>u8</code> |  |
| <code>compressed_text</code> | <code>u8[...]</code> |  |
## InternationalTextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L206](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L206)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>compression_flag</code> | <code><a href="basics.bfec.md#bool">bool</a></code> |  |
| <code>compression_method</code> | <code>u8</code> |  |
| <code>language_tag</code> | <code>ascii<null></code> |  |
| <code>translated_keyword</code> | <code>u8[null]</code> |  |
| <code>text</code> | <code><a href="#internationaltextdatabody">InternationalTextDataBody</a></code> |  |
## GreyscaleBackgroundData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L224](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L224)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>greyscale</code> | <code>u16_be</code> |  |
## TruecolorBackgroundData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L228](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L228)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
## IndexedColorBackgroundData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L234](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L234)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_index</code> | <code>u8</code> |  |
## ImageHistogramData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L238](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L238)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>frequencies</code> | <code>u16_be[...]</code> |  |
## PhysicalPixelDimensionsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L247](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L247)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>ppu_x</code> | <code>u32_be</code> |  |
| <code>ppu_y</code> | <code>u32_be</code> |  |
| <code>unit</code> | <code><a href="#pixeldimensionunit">PixelDimensionUnit</a></code> |  |
## Sample8Bit

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L258](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L258)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
| <code>alpha</code> | <code>u8</code> |  |
## Sample16Bit

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L265](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L265)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
| <code>alpha</code> | <code>u16_be</code> |  |
## SuggestedPalleteData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L278](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L278)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_name</code> | <code>ascii<null></code> |  |
| <code>sample_depth</code> | <code><a href="#sampledepth">SampleDepth</a></code> |  |
| (todo: struct expansion) | <code><a href="#sample">Sample</a></code> | |
| <code>frequencies</code> | <code>u16_be[...]</code> | sample: Sample(@.sample_depth); |
## LastModifiedTimestampData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L286](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L286)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>year</code> | <code>u16_be</code> |  |
| <code>month</code> | <code>u8</code> |  |
| <code>day</code> | <code>u8</code> |  |
| <code>hour</code> | <code>u8</code> |  |
| <code>minute</code> | <code>u8</code> |  |
| <code>second</code> | <code>u8</code> |  |
## ChunkData

**Switch**

**Type:** <code><a href="#chunktype">ChunkType</a></code>

_Source: [~/png.bfec#L49](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L49)_



## TransparencyData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L116](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L116)_



## SignifigantBitsData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L158](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L158)_



## InternationalTextDataBody

**Switch**

**Type:** <code><a href="basics.bfec.md#bool">bool</a></code>

_Source: [~/png.bfec#L201](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L201)_



## BackgroundColorData

**Switch**

**Type:** <code><a href="#colortype">ColorType</a></code>

_Source: [~/png.bfec#L215](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L215)_



## Sample

**Switch**

**Type:** <code><a href="#sampledepth">SampleDepth</a></code>

_Source: [~/png.bfec#L272](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L272)_



## ChunkType

**Enum**

**Type:** <code>ascii<4></code>

_Source: [~/png.bfec#L28](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L28)_



## BitDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L71](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L71)_



## CompressionMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L79](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L79)_



## FilterMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L83](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L83)_



## InterlaceMethod

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L87](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L87)_



## ColorType

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L102](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L102)_



## RGBRenderingIntent

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L179](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L179)_



## PixelDimensionUnit

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L242](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L242)_



## SampleDepth

**Enum**

**Type:** <code>u8</code>

_Source: [~/png.bfec#L253](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L253)_


