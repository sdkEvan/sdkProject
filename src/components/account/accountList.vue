<template>
	<div class="accountList" :class="{tableAccountHeight: isExist,tabAccountHeight: !isExist}" v-loading="loading">
		<el-table :data="tableData" style="width: 100%;" @expand-change="changeExpand" stripe :row-class-name="setRowname" border ref="accountList" :height="userTableHeight">
			<el-table-column type="expand">
				<template slot-scope="props">
					<account-list v-if="props.row.LOGIN" :id="props.row.LOGIN"></account-list>
				</template>
			</el-table-column>
			<el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip>
				<template slot-scope="scope">
					<!-- 点击账号获取交易历史 -->
					<span v-if="item.propName == 'LOGIN'">
						<span class="loginClass" @click="getLoginInfo(scope.row.LOGIN)">{{scope.row[item.propName]}}</span>
					</span>
					<!-- 点击姓名获取用户信息 -->
					<span v-else-if="item.propName == 'NAME'">
						<span class="loginClass" @click="getUserInfo(scope.row)">{{scope.row[item.propName]}}</span>
					</span>
					<span v-else>{{scope.row[item.propName]}}</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10,15,20,30 ,50,100,200]"
				:page-size="tablePageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
		<!-- dialog 获取交易历史 -->
		<el-dialog title="" class="historyDialog" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
			<div class="dialogTitle" slot="title">
				<el-button type="info" :class="{btnActive: isActive}" @click="toPosition" v-if="showtradeReport">{{$t('button.positionReport')}}</el-button>
				<el-button type="info" :class="{btnActive: !isActive}" @click="toHistory">{{$t('button.tradingHistory')}}</el-button>
				<el-date-picker v-model="dateValue" @change="changeDate" type="daterange" align="right" unlink-panels :range-separator="$t('button.to')" :start-placeholder="$t('button.startDate')" :end-placeholder="$t('button.endDate')"  value-format="yyyy-MM-dd" style="margin-left: 30px;"></el-date-picker>
			</div>
			<div class="dialogContent" v-loading="tradeLoading">
				<el-table :data="tradeTable" ref="accountTradeTable" style="width: 100%" stripe border height="450">
                    <el-table-column v-for="(item,index) in tradeTableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" v-if="item.status"></el-table-column>
                </el-table>
                <div class="page">
                    <el-pagination
                        @size-change="tradeSizeChange"
                        @current-change="tradeCurrentChange"
                        :current-page="tradeCurrentPage"
                        :page-sizes="[10,15,20,30 ,50,100,200]"
                        :page-size="tradePageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tradeTotal">
                    </el-pagination>
                </div>
			</div>
		</el-dialog>
		<!-- dialog 获取用户信息 -->
		<el-dialog :title="$t('dialog.userInfo')" class="userDialog" :visible.sync="userVisible" width="50%" :before-close="closeUserinfo">
			<div v-loading="userInfoLoading">
				<div class="userInfo" v-for="(item,i) in userInfoArr" :key="i">
					<div class="userLabel">{{item.label}}</div>
					<div class="userValue">{{item.value}}</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import accountList from "@/components/account/accountList";
import { getTradeList , getTradeHistory , getProUserinfo } from "@/api/user/user";
import { getAccountList } from "@/api/account/account";
import { getNowDate , getFirstDate , money , inArray , getSession } from "@/utils/utils"
export default {
	name: "accountList",
	data() {
		return {
			tableData: [],
            currentPage: 1,
			total: 0,
			tablePageSize: 20,
			tableHead: [
				{ propName: 'LOGIN',labelName: this.$t('table.account'),width: '80' },
				{ propName: 'NAME',labelName: this.$t('table.name'),width: '100' },
				{ propName: 'PHONE',labelName: this.$t('table.contact'),width: '100' },
				{ propName: 'EMAIL',labelName: this.$t('table.email'),width: '130' },
				{ propName: 'LEVERAGE',labelName: this.$t('table.leverage'),width: '80' },
				{ propName: 'REGDATE',labelName: this.$t('table.opentime'),width: '150' },
				{ propName: 'COMMENT',labelName: this.$t('table.note'),width: '150' },
				{ propName: 'operation',labelName: this.$t('table.operate'),width: '100'},
			],
			loading: false,
			isExist: false,
			dialogVisible: false,
			isActive: true,
			dateValue: null,
			lastChildDate: null,
			pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
			/* 交易记录表格 dialog */
			tradeTable: [],
			tradeTableHead: [
				{ propName: 'TICKET',labelName: this.$t('table.ticket'),width: '100',status: true },
				{ propName: 'LOGIN',labelName: this.$t('table.account'),width: '80',status: true },
				{ propName: 'NAME',labelName: this.$t('table.name'),width: '100',status: true },
				{ propName: 'OPEN_TIME',labelName: this.$t('table.positionOpentime'),width: '150',status: true },
				{ propName: 'CMD',labelName: this.$t('table.type'),width: '100',status: true },
				{ propName: 'SYMBOL',labelName: this.$t('table.symbol'),width: '100',status: true },
				{ propName: 'VOLUME',labelName: this.$t('indexLang.volume'),width: '100',status: true },
				{ propName: 'OPEN_PRICE',labelName: this.$t('table.openprice'),width: '100',status: true },
				{ propName: 'SL',labelName: this.$t('table.stoploss'),width: '100',status: true },
				{ propName: 'TP',labelName: this.$t('table.topprofit'),width: '100',status: true },
				{ propName: 'CLOSE_TIME',labelName: this.$t('table.closeTime'),width: '150',status: true },
                { propName: 'ORDER_ID',labelName: this.$t('table.orderId'),width: '100',status: true },
				{ propName: 'COMMISSION',labelName: this.$t('table.commiss'),width: '100',status: true },
				{ propName: 'SWAPS',labelName: this.$t('table.swaps'),width: '100',status: true },
				{ propName: 'PROFIT',labelName: this.$t('table.profit'),width: '100',status: true }
			],
			tradeCurrentPage: 1,
			tradePageSize: 20,
			tradeTotal: 0,
			tradeLoading: false,
			currentLogin: '',
			userVisible: false,
			userInfoArr: [
				{label: this.$t('table.name'),value: ''},
				{label: this.$t('table.username'),value: ''},
				{label: this.$t('table.regtime'),value: ''},
				{label: this.$t('table.mt4Bala'),value: ''},
				{label: this.$t('indexLang.ibReport'),value: ''},
				{label: this.$t('table.regAddress'),value: ''}
			],
			userTableHeight: 0,
			userInfoLoading: false
		};
	},
	props: {
		/* 父组件传过来的值 */
		rootData: {
			type: Array,
			default() {
				return [];
			}
		},
		id: {
            type: String,
			default() {
				return '';
			}
		},
		pTableTotal: {
            type: Number,
			default() {
				return 0;
			}
		},
		pCurrentPage: {
            type: Number,
			default() {
				return 1;
			}
		},
		pPageSize: {
			type: Number,
			default() {
				return 10;
			}
		}
	},
	watch: {
		/* 若pagesize发生变化，调整表格的高度 */
		tablePageSize(newVal){
			if(newVal == 10){
				this.isExist = false;
			}else{
				this.isExist = true;
			}
		},
		rootData(newVal){
			this.tableData = newVal;
		},
		pTableTotal(v){
			this.total = v;
		}
	},
	created() {
		/* 若id为0，说明为父层 */
		if(this.id == 0){
			this.currentPage = this.pCurrentPage;
			this.tablePageSize = this.pPageSize;
		}
	},
	computed: {
		/* 表格中 是否可查看持仓列表 */
		showtradeReport(){
			return inArray('trade_report',getSession('authList'));
		},
	},
	mounted() {
		/* 根据不同屏幕大小设定table高度 */
		this.userTableHeight = $('#app')[0].clientHeight - 315;

		// 获取表格数据
        if (this.rootData.length == 0) {
			if(this.id){
				this.getData(this.id,this.currentPage);
			}
        }else{
			this.$nextTick( () => {
				this.tableData = this.rootData;
				this.total = this.pTableTotal;
			})
		}
	},
	components: {
		accountList
	},
	methods: {
		setRowname({row, rowIndex}){
			if(row.ROLE == '0'){
				return 'hideIcon';
			}else{
				return 'iconStyle';
			}
		},
		changeExpand(row,expanded){
			
		},
		/* pagesize改变 */
		handleSizeChange(val){
			this.currentPage = 1;
			this.tablePageSize = val;
			if(this.id){
				this.getData(this.id,this.currentPage);
			}else{
				this.$emit('page-size', this.currentPage ,this.tablePageSize);
			}
		},
		/* 当前页改变 */
		handleCurrentChange(n){
			this.currentPage = n;
			if(this.id){
				this.getData(this.id, n );
			}else{
				this.$emit('current-page', n ,this.tablePageSize);
			}
		},
		// 接口
        getData(id,page) {
			let params = {
				//login: '102540',
				login: id,
				page: page,
				page_size: this.tablePageSize
			}
			this.loading = true;
			getAccountList(params).then( v => {
				this.loading = false;
				if(v.code == 0){
					this.tableData = v.data.row;
					this.total = v.data.total*1;
				}else{
					this.$message({
                        message: v.msg,
                        type: 'error'
                    });
				}
			})
		},
		/* 获取该账号信息 */
		getLoginInfo(v){
			this.isActive = true;
			this.currentLogin = v;
			this.dialogVisible = true;
			this.scrollToLeft();
			/* dialog 初始化时间范围 */
			this.dateValue = [getFirstDate(),getNowDate()];
			this.lastChildDate = this.dateValue;
			//this.getTradeInfo();
			if(!this.showtradeReport){
				this.isActive = false;
				this.getHistoryInfo();
			}else{
				this.getTradeInfo();
			}
		},
		/* dialog中table的滚动条初始化到最左边 */
		scrollToLeft(){
			this.$nextTick( () => {
				let tableObj = this.$refs.accountTradeTable.$el.getElementsByClassName('el-table__body-wrapper')[0];
				tableObj.scrollLeft = 0;
            })
		},
		getTradeInfo(){
			/* 切换表头 */
			this.tradeTableHead.map( v => {
				if(v.propName == 'CLOSE_TIME' || v.propName == 'ORDER_ID' || v.propName == 'COMMISSION'){
					v.status = false;
				}
			})
			let params = {
				login: this.currentLogin,
				//login: '112502',
				page: this.tradeCurrentPage,
				page_size: this.tradePageSize
			}
			if(this.dateValue && this.dateValue.length > 0){
				params.start_time_format = this.dateValue[0];
				params.end_time_format = this.dateValue[1];
			}
			this.tradeLoading = true;
			this.tradeTable = [];
			getTradeList(params).then( data => {
				this.tradeLoading = false;
				if(data.code == 0){
					this.tradeTable = data.data.row;
					this.tradeTotal = data.data.total*1;
				}else{
					this.$message({
                        message: data.msg,
                        type: 'error'
                    });
				}
			})
		},
		/* 获取该账号历史信息 */
		getHistoryInfo(){
			/* 切换表头 */
			this.tradeTableHead.map( v => {
				if(v.propName == 'CLOSE_TIME' || v.propName == 'ORDER_ID' || v.propName == 'COMMISSION'){
					v.status = true;
				}
			})
			let params = {
				login: this.currentLogin,
				//login: '112502',
				page: this.tradeCurrentPage,
				page_size: this.tradePageSize
			}
			if(this.dateValue && this.dateValue.length > 0){
				params.start_time_format = this.dateValue[0];
				params.end_time_format = this.dateValue[1];
			}
			this.tradeLoading = true;
			this.tradeTable = [];
			getTradeHistory(params).then( data =>{
				this.tradeLoading = false;
				if(data.code == 0){
					this.tradeTable = data.data.row;
					this.tradeTotal = data.data.total*1;
				}else{
					this.$message({
                        message: data.msg,
                        type: 'error'
                    });
				}
			})
		},
		/* 关闭dialog */
		handleClose(){
			this.dialogVisible = false;
		},
		/* 关闭用户信息dialog */
		closeUserinfo(){
			this.userVisible = false;
		},
		/* 切换持仓 */
		toPosition(){
			this.isActive = true;
			this.scrollToLeft();
			this.getTradeInfo();
		},
		/* 切换交易历史 */
		toHistory(){
			this.isActive = false;
			this.scrollToLeft();
			this.getHistoryInfo();
		},
		/* 日期范围筛选 */
		changeDate(v){
			/* if(this.isActive){
				this.getTradeInfo();
			}else{
				this.getHistoryInfo();
			} */
			if(this.dateValue == this.lastChildDate){
                return;
            }else{
                this.lastChildDate = this.dateValue;
                if(this.isActive){
					this.getTradeInfo();
				}else{
					this.getHistoryInfo();
				}
            }
		},
		/* dialog pagesize改变 */
		tradeSizeChange(v){
			this.tradeCurrentPage = 1;
			this.tradePageSize = v;
			if(this.isActive){
				this.getTradeInfo();
			}else{
				this.getHistoryInfo();
			}
		},
		/* dialog 当前页改变 */
		tradeCurrentChange(v){
			this.tradeCurrentPage = v;
			if(this.isActive){
				this.getTradeInfo();
			}else{
				this.getHistoryInfo();
			}
		},
		/* 获取用户信息 */
		getUserInfo(v){;
			this.userVisible = true;
			/* this.userInfoArr.find( data => {
				switch(data.label){
					case this.$t('table.name'):
						data.value = v.NAME;
						break;
					case this.$t('table.username'):
						data.value = v.LOGIN;
						break;
					case this.$t('table.regtime'):
						data.value = v.REGDATE;
						break;
					case this.$t('table.mt4Bala'):
						data.value = v.ADDRESS;
						break;
					case this.$t('indexLang.ibReport'):
						data.value = v.BALANCE;
						break;
					case this.$t('table.regAddress'):
						data.value = v.AGENT_ACCOUNT;
						break;
				}
			}) */
			let params = {
				login: v.LOGIN,
				role: v.ROLE
			}
			this.userInfoLoading = true;
			getProUserinfo(params).then( value => {
				this.userInfoLoading = false;
				let val = value.data;
				this.userInfoArr.find( data => {
					switch(data.label){
						case this.$t('table.name'):
							data.value = val.NAME;
							break;
						case this.$t('table.username'):
							data.value = val.LOGIN;
							break;
						case this.$t('table.regtime'):
							data.value = val.REGDATE;
							break;
						case this.$t('table.mt4Bala'):
							data.value = val.BALANCE;
							break;
						case this.$t('indexLang.ibReport'):
							data.value = val.AGENT_ACCOUNT == '0' ? '-' : val.AGENT_ACCOUNT;
							break;
						case this.$t('table.regAddress'):
							data.value = val.ADDRESS;
							break;
					}
				})
			})
		},
	}
};
</script>
<style rel="stylesheet/scss" lang="scss">
.accountList{
	.page{
		text-align: center;
		margin-top: 20px;
	}
	.loginClass:hover{
		cursor: pointer;
		text-decoration: underline;
		color: #409eff;
	}
	.dialogTitle{
		padding-bottom: 15px;
		/* border-bottom: 1px solid #e5e5e5; */
		.btnActive{
			background: #fd7510 !important;
			border-color: #fd7510 !important;
		}
	}
	.userInfo{
		display: -webkit-flex;
		line-height: 40px;
		.userLabel{
			flex: 1;
			text-align: right;
			font-weight: bold;
		}
		.userValue{
			flex: 3;
			padding-left: 30px;
		}
	}
}
</style>
<style>
.accountList .el-table th{
	background: rgb(223, 240, 216);
}
.accountList .el-table__expanded-cell[class*=cell]{
	padding: 10px 20px;
}
.accountList .el-table .cell{
	height: 23px;
}
.tableAccountHeight .el-table td,.tableAccountHeight .el-table th{
	padding: 5px 0px;
}
.tabAccountHeight .el-table td,.tabAccountHeight .el-table th{
	padding: 8px 0px;
}
</style>
