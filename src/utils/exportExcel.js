/**
 * Created by Evan on 18/01/10.
 */
import { export_json_to_excel } from "@/vendor/Export2Excel";

export function parseTime(time, cFormat) {
	if(arguments.length === 0){
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if(typeof time === 'object'){
		date = time
	}else{
		if(('' + time).length === 10) time = parseInt(time) * 1000
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

/* 导出excel 方法 */
export function exportExcelMethod(targetExcelData,tHeader,filterVal,tableName){
	let pData = formatJson(filterVal,targetExcelData);
	export_json_to_excel(tHeader, pData, tableName);
}

export function formatJson(filterVal, jsonData){
	return jsonData.map(v =>
		filterVal.map(j => {
			return v[j];
		})
	);
}

/* 深拷贝数组 */
export function copyArr(arr){
	return arr.map((e)=>{
		if(typeof e === 'object'){
			return Object.assign({},e);
		}else{
			return e;
		}
	})
}