
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T05:05:33.454Z
*/

const crc_table = new Uint32Array(256);

// Build crc table
{
	let c: number;

	for (let i = 0; i < 256; i++) {
		c = i;

		for (let k = 0; k < 8; k++) {
			c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
		}

		crc_table[i] = c;
	}
}

export function crc32(data: Uint8Array) : number {
	let crc = 0 ^ (-1);

	for (let i = 0; i < data.length; i++) {
		crc = (crc >>> 8) ^ crc_table[crc ^ data[i]];
	}

	return (crc ^ (-1)) >>> 0;
}
