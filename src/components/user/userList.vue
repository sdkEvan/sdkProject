<template>
	<div class="userList" v-loading="loading">
		<el-table :data="tableData" style="width: 100%" @expand-change="changeExpand" stripe :row-class-name="setRowname" border ref="userList" :height="userTableHeight">
			<el-table-column type="selection" width="50"></el-table-column>
			<el-table-column type="expand">
				<template slot-scope="props">
					<user-list v-if="props.row.LOGIN" :id="props.row.LOGIN"></user-list>
				</template>
			</el-table-column>
			<el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip>
				<template slot-scope="scope">
					<!-- 点击账号获取交易历史 -->
					<span v-if="item.propName == 'LOGIN'">
						<span v-if="showHistory">
							<span class="loginClass" @click="getLoginInfo(scope.row.LOGIN)">{{scope.row[item.propName]}}</span>
						</span>
						<span v-else>{{scope.row[item.propName]}}</span>
					</span>
					<!-- 点击姓名获取用户信息 -->
					<span v-else-if="item.propName == 'NAME'">
						<span class="loginClass" @click="getUserInfo(scope.row)">{{scope.row[item.propName]}}</span>
					</span>
					<span v-else>{{scope.row[item.propName]}}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('table.operate')" :min-width="150">
				<template slot-scope="scope">
					<span @click="editUser(scope.row)" class="edit-icon" v-if="showEditBtn">
						<i class="fa fa-edit" aria-hidden="true"></i>
					</span>
					<span style="margin-left: 10px;" class="edit-icon" @click="editAuth(scope.row)">
						<span v-if="scope.row.ENABLE == '0'">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
						<span v-if="scope.row.ENABLE == '1'">
							<i class="fa fa-unlock-alt" aria-hidden="true"></i>
						</span>
					</span>
					<span style="margin-left: 5px;" class="send-icon" :class="{iconColor: scope.row.IS_SENT_EMAIL == '0' ? true : false,iconColored: scope.row.IS_SENT_EMAIL == '0' ? false : true}" @click="sendEmail(scope.row)">
						<i class="fa fa-paper-plane" aria-hidden="true"></i>
					</span>
					<span style="margin-left: 5px;" class="send-icon" @click="addLowerUser(scope.row)">
						<i class="fa fa-user-plus" aria-hidden="true"></i>
					</span>
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
				<el-button type="info" :class="{btnActive: !isActive}" @click="toHistory" v-if="showtradeHistory">{{$t('button.tradingHistory')}}</el-button>
				<el-date-picker v-model="dateValue" @change="changeDate" type="daterange" align="right" unlink-panels :range-separator="$t('button.to')" :start-placeholder="$t('button.startDate')" :end-placeholder="$t('button.endDate')" value-format="yyyy-MM-dd" style="margin-left: 30px;"></el-date-picker>
			</div>
			<div class="dialogContent" v-loading="tradeLoading">
				<el-table :data="tradeTable" ref="tradeTable" style="width: 100%" stripe border height="450">
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
		<!-- 修改用户dialog -->
		<div class="editDialog">
            <el-dialog :title="$t('dialog.editUser')" ref="editDialog" :visible.sync="editVisible" width="70%" :before-close="editClose">
                <el-row :gutter="20" class="edit-form">
                    <el-form ref="editForm" :model="editForm" label-width="200px" :rules="editRules">
                        <el-col :span="11" class="editLeftform">
                            <el-form-item :label="$t('dialog.username')" prop="username">
                                <el-input v-model="editForm.username" :placeholder="$t('placeholder.enterUsername')" disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.password')" prop="password">
                                <el-input v-model="editForm.password" :placeholder="$t('placeholder.enterPass')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.confirmPass')" prop="verifyPass">
                                <el-input v-model="editForm.verifyPass" :placeholder="$t('placeholder.enterPassAgain')"></el-input>
                            </el-form-item>
                            <el-form-item label="Email" prop="email">
                                <el-input v-model="editForm.email" :placeholder="$t('placeholder.enterEmail')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.userGroup')" prop="userGroup">
                                <el-select v-model="editForm.userGroup" clearable :placeholder="$t('placeholder.selectGroup')" @change="changeGroup">
                                    <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.Superior')" prop="superior">
                                <!-- <el-select v-model="editForm.superior" clearable :placeholder="$t('placeholder.selectSuperior')" @change="changeSuperior">
                                    <el-option v-for="item in superiorOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select> -->
								<el-input v-model="editForm.superior" :placeholder="$t('placeholder.selectSuperior')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13" class="editRightform">
                            <el-form-item :label="$t('table.enName')" prop="enName">
                                <el-input v-model="editForm.enName" :placeholder="$t('placeholder.enterName')"></el-input>
                            </el-form-item>
							<el-form-item :label="$t('table.cnName')" prop="cnName">
                                <el-input v-model="editForm.cnName" :placeholder="$t('placeholder.enterName')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.mobile')" prop="phone">
                                <el-input v-model="editForm.phone" :placeholder="$t('placeholder.enterPhone')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.checkGroup')" prop="groupRadio">
                                <el-radio v-model="editForm.groupRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="editForm.groupRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.checkMobile')" prop="contactRadio">
                                <el-radio v-model="editForm.contactRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="editForm.contactRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.lock')" prop="loginRadio">
                                <el-radio v-model="editForm.loginRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="editForm.loginRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editClose">{{$t('button.cancle')}}</el-button>
                    <el-button type="primary" @click="editUserSubmit">{{$t('button.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>
		<!-- 添加下级用户 -->
		<el-dialog :title="$t('dialog.addLowerUser')" :visible.sync="lowerVisible" width="80%" :before-close="lowerClose">
			<el-row :gutter="15" style="max-height: calc(100vh - 400px);overflow:auto;">
				<el-col class="marginBtm" :span="4" v-for="(val,index) in lowerTotal" :key="index">
					<el-input v-model="val.value" :placeholder="$t('placeholder.enterLowerUser')" @input="checkInput(val.value,index)"></el-input>
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="lowerClose">{{this.$t('button.cancle')}}</el-button>
				<el-button type="primary" @click="lowerSubmit">{{this.$t('button.confirm')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import userList from "@/components/user/userList";
import { getSubordinateUser , getTradeList , getTradeHistory , editUser , editUserAuth , bindLowerAccount ,sendEmail , getProUserinfo } from "@/api/user/user";
import { isWscnEmail } from '@/utils/validate';
import { getNowDate , getFirstDate , money , inArray , getSession } from "@/utils/utils"
export default {
	name: "userList",
	data() {
		return {
			tableData: [],
            currentPage: 1,
			total: 0,
			tablePageSize: 20,
			tableHead: [
				{ propName: 'LOGIN',labelName: this.$t('table.username'),width: '90' },
				{ propName: 'NAME',labelName: this.$t('table.name'),width: '100' },
				{ propName: 'ROLE',labelName: this.$t('table.role'),width: '100' },
				{ propName: 'SUPERIOR',labelName: this.$t('table.superior'),width: '100' },
				{ propName: 'EMAIL',labelName: this.$t('table.email'),width: '130' },
				{ propName: 'PHONE',labelName: this.$t('table.contact'),width: '100' },
				{ propName: 'REGDATE',labelName: this.$t('table.regtime'),width: '150' },
				{ propName: 'LAST_LOGIN_TIME',labelName: this.$t('table.lasttime'),width: '150' }
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
                        text: this.$t('button.latelyWeek'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('button.latelyMonth'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('button.latelyThreeMonth'),
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
			editForm: {
				username: '',
                password: '',
                verifyPass: '',
                email: '',
                enName: '',
                cnName: '',
                phone: '',
                userGroup: '',
                groupRadio: '',
                contactRadio: '',
                loginRadio: '',
                superior: ''
			},
			editVisible: false,
			groupOptions: [
                {label: this.$t('dialog.systemAdmin'),value: '11'},
                {label: this.$t('dialog.introducedBroker'),value: '12'}
            ],
            superiorOptions: [
                {label: '系统管理员',value: '系统管理员'},
                {label: '介绍经纪商',value: '介绍经纪商'}
            ],
			editRules: {
                username: [
		            { validator: this.validateUsername, required: true, trigger: 'blur' },
	          	],
	          	password: [
	            	{ validator: this.validatePass, required: false, trigger: 'blur' }
	          	],
	          	verifyPass: [
	            	{ validator: this.validatePassAgain, required: false, trigger: 'blur' }
                ],
                email: [
		            { validator: this.validateEmail, required: true, trigger: 'blur' },
                ],
                userGroup: [
                    { required: true, message: this.$t('placeholder.selectGroup'), trigger: 'change' }
                ],
                superior: [
                    { required: true, message: this.$t('placeholder.selectSuperior'), trigger: 'blur' }
                ],
                enName: [
		            { required: true, message: this.$t('placeholder.enterName'), trigger: 'blur' },
				],
				cnName: [
		            { required: true, message: this.$t('placeholder.enterName'), trigger: 'blur' },
                ],
                /* phone: [
		            { validator: this.validatePhone, required: true, trigger: 'blur' },
				], */
				phone: [
		            { message: this.$t('placeholder.enterPhone'), required: true, trigger: 'blur' },
				],
				groupRadio: [
		            { required: true,  trigger: 'change' },
                ],
                contactRadio: [
		            { required: true,  trigger: 'change' },
                ],
                loginRadio: [
		            { required: true,  trigger: 'change' },
                ]  
                  
			},
			lowerVisible: false,
			lowerTotal: [
				{
					value: ''
				}
			],
			parentId: '',
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
		/* tablePageSize(newVal){
			if(newVal == 10){
				this.isExist = false;
			}else{
				this.isExist = true;
			}
		}, */
		rootData(newVal){
			this.tableData = newVal;
		},
		pTableTotal(v){
			this.total = v;
		},
		lowerTotal: {
			handler: function (data) {

			},
			deep: true
		},
	},
	computed: {
		/* 表格中 是否可点击查看交易历史 */
		showHistory(){
			if(inArray('manage_index',getSession('authList')) || inArray('manage_index',getSession('authList'))){
				return true;
			}else{
				return false;
			}
		},
		/* 表格中 是否可查看持仓列表 */
		showtradeReport(){
			return inArray('trade_report',getSession('authList'));
		},
		/* 表格中 是否可查看交易历史 */
		showtradeHistory(){
			return inArray('trade_history_report',getSession('authList'));
		},
		/* 是否显示 修改按钮 */
        showEditBtn(){
            return inArray('update',getSession('authList'))
        },
        /* 是否显示 锁定按钮 */
        showLockBtn(){
            return inArray('lock',getSession('authList'))
        },
        /* 是否显示 发送邮件按钮 */
        showEmailBtn(){
            return inArray('send_account_email',getSession('authList'))
        },
        /* 是否显示 添加下级用户按钮 */
        showLowerBtn(){
            return inArray('bind_trading_account',getSession('authList'))
        },
	},
	created() {
		/* 若id为0，说明为父层 */
		if(this.id == 0){
			this.currentPage = this.pCurrentPage;
			this.tablePageSize = this.pPageSize;
		}
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
		userList
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
			getSubordinateUser(params).then( v => {
				this.loading = false;
				if(v.code == 0){
					let tData = v.data.row;
					tData.map( v => {
						if(this.$i18n.locale == 'en'){
                            v.ROLE = v.ROLE_EN;
                        }
					})
					this.tableData = tData;
					this.total = v.data.total*1;
				}
			})
		},
		checkInput(val,i) {
			if(val && (i === this.lowerTotal.length-1)){
				this.lowerTotal.push({value: ''});
			}
			if(!val){
				this.lowerTotal.splice(i,1);
			}
		},
		/* 获取用户信息 */
		getUserInfo(v){
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
				role: v.ROLE_ID
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
		/* 获取该账号信息 */
		getLoginInfo(v){
			this.isActive = true;
			this.currentLogin = v;
			this.dialogVisible = true;
			this.scrollToLeft();
			/* dialog 初始化时间范围 */
			this.dateValue = [getFirstDate(),getNowDate()];
			this.lastChildDate = this.dateValue;
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
				let tableObj = this.$refs.tradeTable.$el.getElementsByClassName('el-table__body-wrapper')[0];
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
				}
			})
		},
		/* 关闭交易历史dialog */
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
		/* 关闭添加dialog */
        editClose(){
            this.editVisible = false;
            this.$refs.editForm.resetFields();
		},
		/* 用户名验证 */
        validateUsername(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterUsername')));
	        }else{
	        	var ptn = /^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.usernameIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 密码验证 */
    	validatePass(rule, value, callback){
			if(value === ''){
	          	callback();
	        }else{
	        	var ptn = /^[A-Za-z0-9]{5,15}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.passIllegality')));
	        	}else{
	        		if(this.editForm.verifyPass !== ''){
		            	this.$refs.editForm.validateField('verifyPass');
		          	}
		          	callback();
	        	}	
	        }
        },
        /* 再次验证密码 */
    	validatePassAgain(rule, value, callback){
			if(value === ''){
	          	callback();
	        }else if(value !== this.editForm.password) {
	          	callback(new Error(this.$t('placeholder.passagainError')));
	        } else {
	          	callback();
	        }
        },
        /* 邮箱验证 */
        validateEmail(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterEmail')));
	        }else{
                var res = isWscnEmail(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.emailIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 姓名验证 */
        validateName(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterName')));
	        }else{
	        	var ptn = /^[A-Za-z0-9\u4e00-\u9fa5]{2,15}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.nameIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 手机验证 */
        validatePhone(rule, value, callback){
            if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterPhone')));
	        }else{
	        	var ptn = /^1[34578]\d{9}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.iphoneIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
		},
		/* 选择用户组 */
        changeGroup(){
            
		},
		changeSuperior(){
            
		},
		/* 修改用户信息 */
		editUser(row){
			this.editVisible = true;
			if(this.$refs.editForm){
				this.$refs.editForm.resetFields();
			}
			this.editForm.username = row.LOGIN;
			this.editForm.email = row.EMAIL;
			this.editForm.superior = row.SUPERIOR;
			this.editForm.enName = row.NAME;
			this.editForm.cnName = row.NAME_CN;
			this.editForm.phone = row.PHONE;
			this.editForm.groupRadio = row.IS_SHOW_GROUP;
			this.editForm.contactRadio = row.IS_SHOW_CONTACT;
			this.editForm.loginRadio = row.ENABLE;
			this.groupOptions.map( v =>{
				if(v.label == row.ROLE){
					this.editForm.userGroup = v.value;
				}
			})
		},
		/* 修改用户 提交 */
        editUserSubmit(){
            this.$refs.editForm.validate( (valid) => {
                if(valid){
                    let params = {
                        username: this.editForm.username,
                        password: this.editForm.password,
                        repassword: this.editForm.verifyPass,
                        email: this.editForm.email,
                        mobile: this.editForm.phone,
                        role: this.editForm.userGroup,
                        real_name: this.editForm.enName,
                        real_name_cn: this.editForm.cnName,
                        is_show_group: Number(this.editForm.groupRadio),
                        is_show_contact: Number(this.editForm.contactRadio),
                        enable: Number(this.editForm.loginRadio),
                        superior: this.editForm.superior
					}
                    editUser(params).then( data => {
                        if(data.code == 0){
                            this.$message({
                                message: this.$t('placeholder.edituserSuccess'),
                                type: 'success'
                            });
							this.editVisible = false;
							if(this.id == 0){
								this.$emit('getUserList');
							}else{
								this.getData(this.id,this.currentPage)
							}
                        }
                    })
                }
            })
		},
		/* 修改用户权限 */
		editAuth(row){
			let params = {
				username: row.LOGIN,
				enable: row.ENABLE == '1' ? '0' : '1'
			}
			editUserAuth(params).then( v => {
				if(v.code == 0){
					if(this.id == 0){
						this.$emit('getUserList');
					}else{
						this.getData(this.id,this.currentPage)
					}
				}else{
					this.$message({
                        message: v.msg,
                        type: 'error'
                    });
				}
			})
		},
		/* 发送邮件 */
		sendEmail(row){
			if(row.IS_SENT_EMAIL == 0){
				this.sendEmailNow(row.LOGIN);
			}else{
				this.$confirm(this.$t('placeholder.confirmEmail'), this.$t('home.hint'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancle'),
					type: 'warning'
				}).then(() => {
					this.sendEmailNow(row.LOGIN);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: this.$t('placeholder.sendCancle')
					});          
				});
			}
		},
		sendEmailNow(login){
			let params = {
				username: login
			}
			this.loading = true;
			sendEmail(params).then( v => {
				this.loading = false;
				if(v.code == 0){
					this.$message({
						message: this.$t('placeholder.sendEmailSuccess'),
						type: 'success'
					});
					if(this.id == 0){
						this.$emit('getUserList');
					}else{
						this.getData(this.id,this.currentPage)
					}
				}else if(v.code == '100009'){
					this.$message({
						message: this.$t('other.haveEditPwd'),
						type: 'warning'
					});
				}
			})	
		},
		/* 添加下级 */
		addLowerUser(row){
			this.lowerVisible = true;
			this.parentId = row.LOGIN;
			this.lowerTotal = [{value: ''}];
		},
		lowerClose(){
			this.lowerVisible = false;
		},
		lowerSubmit(){
			let tData = [];
			this.lowerTotal.map( data => {
				tData.push(data.value);
			})
			tData.forEach( (v,i) => {
				if(v == '' || typeof(v) == 'undefined'){
					tData.splice(i,1);
				}
			})
			let params = {
				username: this.parentId,
				trading_login: tData
			}
			bindLowerAccount(params).then( v => {
				if(v.code == 0){
					this.$message({
						message: this.$t('placeholder.addLowerUserSuccess'),
						type: 'success'
					});
				}
			})
		}
	}
};
</script>
<style rel="stylesheet/scss" lang="scss">
.userList{
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
	.marginBtm{
		margin-top: 15px;
	}
}
</style>
<style>
.el-table th{
	background: rgb(223, 240, 216);
}
.userList .el-table__expanded-cell[class*=cell]{
	padding: 10px 20px;
}
/* .userList .el-table .cell{
	height: 23px;
} */
.el-table__expand-icon{
	margin-bottom: 5px !important;
}
.dialogTitle .el-button+.el-button{
	margin-left: 0px;
}
.userList .el-button--mini,.userList .el-button--mini.is-round{
	padding: 3px 10px;
	height: 25px;
}
.edit-form .el-form-item__label{
    padding: 0 20px 0 0 ;
}
.editLeftform .el-form-item__label{
    width: 155px !important;
}
.editLeftform .el-form-item__content{
    margin-left: 155px !important;
}
.editLeftform .el-select{
    width: 100%;
}
.editDialog .el-dialog__body{
    padding-right: 50px;
}
.edit-icon{
	width: 20px;
	display: inline-block;
}
.send-icon{
	width: 20px;
	display: inline-block;
}
.iconColor .fa{
	color: rgb(22, 194, 194);
}
.iconColored .fa{
	color: #bbb;
}
.edit-icon .fa{
	font-size: 18px;
	vertical-align: middle;
	cursor: pointer;
}
.edit-icon .fa:hover{
	color: #409eff;
}
.send-icon .fa{
	font-size: 14px;
	cursor: pointer;
}
.send-icon .fa:hover{
	color: #409eff;
}
</style>
