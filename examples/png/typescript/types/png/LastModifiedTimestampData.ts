
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';


export interface LastModifiedTimestampData {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
}
export namespace LastModifiedTimestampData {
	
	export function $encode($state: $State, $inst: LastModifiedTimestampData) {
		$state.here.node = $inst;
		$state.step_down('year', $inst.year);
		$state.write_to.write_u16_be($inst.year);
		$state.step_up();
		$state.step_down('month', $inst.month);
		$state.write_to.write_u8($inst.month);
		$state.step_up();
		$state.step_down('day', $inst.day);
		$state.write_to.write_u8($inst.day);
		$state.step_up();
		$state.step_down('hour', $inst.hour);
		$state.write_to.write_u8($inst.hour);
		$state.step_up();
		$state.step_down('minute', $inst.minute);
		$state.write_to.write_u8($inst.minute);
		$state.step_up();
		$state.step_down('second', $inst.second);
		$state.write_to.write_u8($inst.second);
		$state.step_up();
	}
	
	export function $decode($state: $State) : LastModifiedTimestampData {
		const $inst = { } as LastModifiedTimestampData;
		$state.here.node = $inst;
		$state.step_down('year');
		$inst.year = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('month');
		$inst.month = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('day');
		$inst.day = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('hour');
		$inst.hour = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('minute');
		$inst.minute = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('second');
		$inst.second = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
