## Structs

### $

_Source: [~/png.bfec#L7](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L7)_

PNG Image Format
https://www.w3.org/TR/PNG

#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>magic_number</code> | <code>"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"</code> | Magic bytes to identify the PNG file format |
| <code>header</code> | <code><a href="png.bfec.md#Chunk">Chunk</a></code> | Image header should always be the first chunk, and we need to reference data out of it, so we'll statically define it here so we can `$.header` elsewhere |
| <code>chunks</code> | <code><a href="png.bfec.md#Chunk">Chunk</a>[...]</code> | The rest of the file we'll just read as a big list of chunks |
### Chunk

_Source: [~/png.bfec#L17](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L17)_



#### Params

| Field Name | Type |
|------------|------|
| <code>type</code> | <code><a href="png.bfec.md#ChunkType">ChunkType</a></code> |
#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>length</code> | <code>len<u32_be></code> |  |
| <code>type</code> | <code><a href="png.bfec.md#ChunkType">ChunkType</a></code> |  |
| <code>data</code> | <code>u8[(todo: length field)] -> <a href="png.bfec.md#ChunkData">ChunkData</a></code> |  |
| <code>crc</code> | <code>checksum</code> |  |
### ImageHeader

_Source: [~/png.bfec#L81](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L81)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>width</code> | <code>u32_be</code> |  |
| <code>height</code> | <code>u32_be</code> |  |
| <code>bit_depth</code> | <code><a href="png.bfec.md#BitDepth">BitDepth</a></code> |  |
| <code>color_type</code> | <code><a href="png.bfec.md#ColorType">ColorType</a></code> |  |
| <code>compression_method</code> | <code><a href="png.bfec.md#CompressionMethod">CompressionMethod</a></code> |  |
| <code>filter_method</code> | <code><a href="png.bfec.md#FilterMethod">FilterMethod</a></code> |  |
| <code>interlace_method</code> | <code><a href="png.bfec.md#InterlaceMethod">InterlaceMethod</a></code> |  |
### Pallete

_Source: [~/png.bfec#L97](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L97)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
### GreyscaleTransparencyData

_Source: [~/png.bfec#L108](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L108)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>grey_sample</code> | <code>u16_be</code> |  |
### TruecolorTransparencyData

_Source: [~/png.bfec#L111](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L111)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red_sample</code> | <code>u16_be</code> |  |
| <code>green_sample</code> | <code>u16_be</code> |  |
| <code>blue_sample</code> | <code>u16_be</code> |  |
### IndexedColorTransparencyData

_Source: [~/png.bfec#L116](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L116)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>alpha_values</code> | <code>u8[...]</code> |  |
### PrimaryChromaticitiesAndWhitePointData

_Source: [~/png.bfec#L119](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L119)_



#### Fields

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
### GammaData

_Source: [~/png.bfec#L129](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L129)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>image_gamma</code> | <code>u32_be</code> |  |
### EmbeddedICCProfileData

_Source: [~/png.bfec#L132](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L132)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>proile_name</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code><a href="png.bfec.md#CompressionMethod">CompressionMethod</a></code> |  |
| <code>compressed_profile</code> | <code>u8[...]</code> |  |
### GreyscaleSignifigantBitsData

_Source: [~/png.bfec#L145](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L145)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_greyscale_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
### ColorSignifigantBitsData

_Source: [~/png.bfec#L149](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L149)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>signifigant_red_bits</code> | <code>u8</code> |  |
| <code>signifigant_green_bits</code> | <code>u8</code> |  |
| <code>signifigant_blue_bits</code> | <code>u8</code> |  |
| <code>signifigant_alpha_bits</code> | <code>u8</code> |  |
### RGBColorSpaceData

_Source: [~/png.bfec#L161](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L161)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>rendering_intent</code> | <code><a href="png.bfec.md#RGBRenderingIntent">RGBRenderingIntent</a></code> |  |
### TextData

_Source: [~/png.bfec#L164](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L164)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>text</code> | <code>ascii<...></code> |  |
### CompressedTextData

_Source: [~/png.bfec#L168](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L168)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>compression_method</code> | <code>u8</code> |  |
| <code>compressed_text</code> | <code>u8[...]</code> |  |
### InternationalTextData

_Source: [~/png.bfec#L177](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L177)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>keyword</code> | <code>ascii<null></code> |  |
| <code>compression_flag</code> | <code><a href="basics.bfec.md#bool">bool</a></code> |  |
| <code>compression_method</code> | <code>u8</code> |  |
| <code>language_tag</code> | <code>ascii<null></code> |  |
| <code>translated_keyword</code> | <code>u8[null]</code> |  |
| <code>text</code> | <code><a href="png.bfec.md#InternationalTextDataBody">InternationalTextDataBody</a></code> |  |
### GreyscaleBackgroundData

_Source: [~/png.bfec#L193](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L193)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>greyscale</code> | <code>u16_be</code> |  |
### TruecolorBackgroundData

_Source: [~/png.bfec#L196](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L196)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
### IndexedColorBackgroundData

_Source: [~/png.bfec#L201](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L201)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_index</code> | <code>u8</code> |  |
### ImageHistogramData

_Source: [~/png.bfec#L204](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L204)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>frequencies</code> | <code>u16_be[...]</code> |  |
### PhysicalPixelDimensionsData

_Source: [~/png.bfec#L211](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L211)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>ppu_x</code> | <code>u32_be</code> |  |
| <code>ppu_y</code> | <code>u32_be</code> |  |
| <code>unit</code> | <code><a href="png.bfec.md#PixelDimensionUnit">PixelDimensionUnit</a></code> |  |
### Sample8Bit

_Source: [~/png.bfec#L220](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L220)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u8</code> |  |
| <code>green</code> | <code>u8</code> |  |
| <code>blue</code> | <code>u8</code> |  |
| <code>alpha</code> | <code>u8</code> |  |
### Sample16Bit

_Source: [~/png.bfec#L226](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L226)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>red</code> | <code>u16_be</code> |  |
| <code>green</code> | <code>u16_be</code> |  |
| <code>blue</code> | <code>u16_be</code> |  |
| <code>alpha</code> | <code>u16_be</code> |  |
### SuggestedPalleteData

_Source: [~/png.bfec#L237](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L237)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>pallete_name</code> | <code>ascii<null></code> |  |
| <code>sample_depth</code> | <code><a href="png.bfec.md#SampleDepth">SampleDepth</a></code> |  |
| <code>frequencies</code> | <code>u16_be[...]</code> | sample: Sample(@.sample_depth); |
### LastModifiedTimestampData

_Source: [~/png.bfec#L244](https://github.com/kbjr/bfec/blob/schema-rework/examples/png/png.bfec#L244)_



#### Fields

| Field Name | Type | Comments |
|------------|------|----------|
| <code>year</code> | <code>u16_be</code> |  |
| <code>month</code> | <code>u8</code> |  |
| <code>day</code> | <code>u8</code> |  |
| <code>hour</code> | <code>u8</code> |  |
| <code>minute</code> | <code>u8</code> |  |
| <code>second</code> | <code>u8</code> |  |