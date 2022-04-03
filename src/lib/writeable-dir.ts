
export interface WriteableDir {
	write_file(path: string, contents: string) : Promise<void>;
}
