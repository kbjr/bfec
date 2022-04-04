<!-- THIS FILE WAS AUTOMATICALLY GENERATED -->

## $

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L7](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L7)_

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

_Source: [~/png.bfec#L17](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L17)_



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

_Source: [~/png.bfec#L81](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L81)_



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

_Source: [~/png.bfec#L97](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L97)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
## GreyscaleTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L108](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L108)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>grey_sample</code> | <code>u16_be</code> |  |
## TruecolorTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L111](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L111)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red_sample</code> | <code>u16_be</code> |  |
| <code>green_sample</code> | <code>u16_be</code> |  |
| <code>blue_sample</code> | <code>u16_be</code> |  |
## IndexedColorTransparencyData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L116](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L116)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>alpha_values</code> | <code>u8[...]</code> |  |
## PrimaryChromaticitiesAndWhitePointData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L119](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L119)_



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

_Source: [~/png.bfec#L129](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L129)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>image_gamma</code> | <code>u32_be</code> |  |
## EmbeddedICCProfileData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L132](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L132)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>proile_name</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code><a href="#compressionmethod">CompressionMethod</a></code> |  |
| <code>compressed_profile</code> | <code>u8[...]</code> |  |
## GreyscaleSignifigantBitsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L145](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L145)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_greyscale_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
## ColorSignifigantBitsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L149](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L149)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_red_bits</code> | <code>u8</code> |  |
| <code>signifigant_green_bits</code> | <code>u8</code> |  |
| <code>signifigant_blue_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
## RGBColorSpaceData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L161](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L161)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>rendering_intent</code> | <code><a href="#rgbrenderingintent">RGBRenderingIntent</a></code> |  |
## TextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L164](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L164)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>text</code> | <code>ascii<...></code> |  |
## CompressedTextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L168](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L168)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code>u8</code> |  |
| <code>compressed_text</code> | <code>u8[...]</code> |  |
## InternationalTextData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L177](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L177)_



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

_Source: [~/png.bfec#L193](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L193)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>greyscale</code> | <code>u16_be</code> |  |
## TruecolorBackgroundData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L196](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L196)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
## IndexedColorBackgroundData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L201](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L201)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_index</code> | <code>u8</code> |  |
## ImageHistogramData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L204](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L204)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>frequencies</code> | <code>u16_be[...]</code> |  |
## PhysicalPixelDimensionsData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L211](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L211)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>ppu_x</code> | <code>u32_be</code> |  |
| <code>ppu_y</code> | <code>u32_be</code> |  |
| <code>unit</code> | <code><a href="#pixeldimensionunit">PixelDimensionUnit</a></code> |  |
## Sample8Bit

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L220](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L220)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
| <code>alpha</code> | <code>u8</code> |  |
## Sample16Bit

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L226](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L226)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
| <code>alpha</code> | <code>u16_be</code> |  |
## SuggestedPalleteData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L237](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L237)_



### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_name</code> | <code>ascii<null></code> |  |
| <code>sample_depth</code> | <code><a href="#sampledepth">SampleDepth</a></code> |  |
| (todo: struct expansion) | <code><a href="#sample">Sample</a></code> | |
| <code>frequencies</code> | <code>u16_be[...]</code> | sample: Sample(@.sample_depth); |
## LastModifiedTimestampData

**Struct (Byte Aligned)**

_Source: [~/png.bfec#L244](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L244)_



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

_Source: [~/png.bfec#L43](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L43)_



## TransparencyData

**Switch**

_Source: [~/png.bfec#L102](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L102)_



## SignifigantBitsData

**Switch**

_Source: [~/png.bfec#L137](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L137)_



## InternationalTextDataBody

**Switch**

_Source: [~/png.bfec#L173](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L173)_



## BackgroundColorData

**Switch**

_Source: [~/png.bfec#L185](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L185)_



## Sample

**Switch**

_Source: [~/png.bfec#L232](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L232)_



## ChunkType

**Enum**

_Source: [~/png.bfec#L23](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L23)_



## BitDepth

**Enum**

_Source: [~/png.bfec#L64](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L64)_



## CompressionMethod

**Enum**

_Source: [~/png.bfec#L71](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L71)_



## FilterMethod

**Enum**

_Source: [~/png.bfec#L74](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L74)_



## InterlaceMethod

**Enum**

_Source: [~/png.bfec#L77](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L77)_



## ColorType

**Enum**

_Source: [~/png.bfec#L90](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L90)_



## RGBRenderingIntent

**Enum**

_Source: [~/png.bfec#L155](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L155)_



## PixelDimensionUnit

**Enum**

_Source: [~/png.bfec#L207](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L207)_



## SampleDepth

**Enum**

_Source: [~/png.bfec#L216](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L216)_


