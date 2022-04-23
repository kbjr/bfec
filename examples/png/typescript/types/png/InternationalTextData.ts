
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface InternationalTextData {
	keyword: string;
	compression_flag: bool;
	compression_method: number;
	language_tag: string;
	translated_keyword: number[];
	text: InternationalTextDataBody;
}
export namespace InternationalTextData {
	
	export function $encode($state: $State, $inst: InternationalTextData) {
		$state.step_down('keyword', $inst.keyword);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('compression_flag', $inst.compression_flag);
		bool.$encode_aligned($state, $inst.compression_flag);
		$state.step_up();
		$state.step_down('compression_method', $inst.compression_method);
		$state.write_to.write_u8($inst.compression_method);
		$state.step_up();
		$state.step_down('language_tag', $inst.language_tag);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('translated_keyword', $inst.translated_keyword);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('text', $inst.text);
		$state.fatal('Failed to compile switch encoder');
		$state.step_up();
	}
	
	export function $decode($state: $State) : InternationalTextData {
		const $inst = { } as InternationalTextData;
		$state.step_down('keyword');
		$inst.keyword = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('compression_flag');
		$inst.compression_flag = bool.$decode_aligned($state)
		$state.step_up();
		$state.step_down('compression_method');
		$inst.compression_method = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('language_tag');
		$inst.language_tag = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('translated_keyword');
		
		$state.step_up();
		$state.step_down('text');
		$state.fatal('Failed to compile switch decoder');
		$state.step_up();
		return $inst;
	}
}
