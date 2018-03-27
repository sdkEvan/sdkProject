<template>
    <div class="transferCheck">
        <el-card class="box-card">
            <div slot="header" class="transferCheckTitle">
                <span>{{$t('home.transferCheck')}}</span>
                <el-button type="primary" @click="toReportExcel" style="float: right;margin-left: 5px;">{{$t('other.exportExcel')}}</el-button>
                <el-select v-model="withdrawStatus" @change="selectWithdraw" clearable style="float: right;" :placeholder="$t('home.selectAppStatus')">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="checkKey">
                    <el-input v-model="keyWord" :placeholder="$t('placeholder.enterKeyword')" style="margin-right:5px;float: right;" @keyup.native.enter="reloadTransferList"></el-input>
                </span>
            </div>
            <div class="applyTable" v-loading="checkLoading">
                <el-table :data="tableData" ref="transferList" style="width: 100%" stripe border :height="userTableHeight">
                    <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip v-if="item.isShow">
                        <template slot-scope="scope">
                            <span v-if="item.propName == 'STATUS'">
                                <span v-show="scope.row.STATUS === '0'">
                                    <el-tag size="small">{{$t('home.inHand')}}</el-tag>
                                </span>
                                <span v-show="scope.row.STATUS === '1'">
                                    <el-tag type="success" size="small">{{$t('home.figureOut')}}</el-tag>
                                </span>
                                <span v-show="scope.row.STATUS === '2'">
                                    <el-tooltip class="item" effect="dark" :content="scope.row.UPDATE_REASON ? scope.row.UPDATE_REASON : $t('other.noReason')" placement="top" popper-class="user-tooltip">
                                        <el-tag  type="danger" size="small">{{$t('home.rejected')}}</el-tag>
                                    </el-tooltip>
                                </span>
                                <span v-show="scope.row.STATUS === '3'">
                                    <el-tag type="warning" size="small">{{$t('home.canceled')}}</el-tag>
                                </span>
                            </span>
                            <span v-else-if="item.propName == 'LOGIN'">
                                <el-tooltip class="withdrawCountTip" effect="dark" :content="scope.row.CARD_STATUS == '1' ? $t('other.checked') : $t('other.noChecked')" placement="top-start">
                                    <span class="el-icon-my-approve successCharge" v-if="scope.row.CARD_STATUS == '1'"></span>
                                    <span class="el-icon-my-weirenzheng warningCharge" v-else ></span>
                                </el-tooltip>
                                <el-tooltip class="withdrawCountTip" placement="right" popper-class="negativeTooltip">
                                    <div slot="content" class="negativeDetail">
                                        <el-table :data="scope.row.NEGATIVE_LOGIN" style="width: 100%" border>
                                            <el-table-column prop="LOGIN" :label="$t('table.username')"></el-table-column>
                                            <el-table-column prop="BALANCE" :label="$t('table.balance')"></el-table-column>
                                        </el-table>
                                    </div>
                                    <span class="negative countIcon" v-if="scope.row.NEGATIVE_STATUS == '1'">{{$t('other.minus')}}</span>
                                    <span class="negative countIcon" v-else>{{$t('other.plus')}}</span>
                                </el-tooltip>
                                <span class="transferLogin" @click="showBalanceRecord(scope.row)">{{scope.row.LOGIN}}</span>
                            </span>
                            <div v-else-if="item.propName == 'CHARGE'">
                                <el-input v-model="scope.row.chargeValue" class="chargeEdit" :class="{successCharge: scope.row.CARD_STATUS,warningCharge: !scope.row.CARD_STATUS}" @change="toEditCharge(scope.row)">
                                    <i class="el-icon-edit el-input__icon iconEdit" slot="suffix" @click="toEditCharge(scope.row)"></i>
                                </el-input>
                            </div>
                            <span v-else>{{scope.row[item.propName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="operation-class" :label="$t('table.operate')" :min-width="170" v-if="!withdrawStatus || withdrawStatus === '0'" fixed="right">
                        <template slot-scope="scope">
                            <!-- <span @click="toEditWithdraw(scope.row)">
                                <el-button size="mini">{{$t('button.edit')}}</el-button>
                            </span> -->
                            <span @click="toSubmitTransfer(scope.row)">
                                <el-button type="primary" size="mini" :loading="scope.row.affirmBtnLoading">{{$t('button.affirm')}}</el-button>
                            </span>
                            <span @click="toRejectTransfer(scope.row)">
                                <el-button type="danger" size="mini" :loading="scope.row.refuseBtnLoading">{{$t('button.refuse')}}</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="applyPage">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,15,20,30 ,50,100,200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 修改出金申请信息 dialog -->
        <el-dialog :title="$t('dialog.editWithdraw')" :visible.sync="editVisible" width="80%" :before-close="handleClose" top="12vh">
            <div v-loading="editLoading">
                <div class="editWithdraw">
                    <el-row :gutter="15">
                        <el-form :model="editTransferForm" label-width="150px" ref="editTransferForm" :rules="editRules">
                            <el-col :span="12">
                                <el-form-item :label="$t('home.holderName')" prop="login_holder">
                                    <el-input v-model="login_holder" :placeholder="$t('home.enterHolderName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.accountNumber')" prop="username">
                                    <el-input v-model="username" :placeholder="$t('home.enterAccountNumber')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.currency')" prop="currency">
                                    <el-select v-model="editTransferForm.currency" clearable :placeholder="$t('home.selectCurrency')">
                                        <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('home.amount')" prop="amount">
                                    <el-input v-model="editTransferForm.amount" :placeholder="$t('home.enterAmount')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.charge')" prop="charge">
                                    <el-input v-model="editTransferForm.charge" :placeholder="$t('home.enterCharge')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.payeeName')" prop="full_name">
                                    <el-input v-model="full_name" :placeholder="$t('home.enterPayeeName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankName')" prop="bank_name">
                                    <el-input v-model="editTransferForm.bank_name" :placeholder="$t('home.enterBankName')"></el-input>
                                        <!-- <div>温馨提示：银行账户姓名应于SVSFX交易账户姓名一致；
                                        当月第一笔银联出金免费,再次申请银联出金则每次收取10美金手续费。</div> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('home.province')" prop="bank_province">
                                    <el-input v-model="editTransferForm.bank_province" :placeholder="$t('home.enterPorvince')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.city')" prop="bank_city">
                                    <el-input v-model="editTransferForm.bank_city" :placeholder="$t('home.enterCity')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankBranch')" prop="bank_branch">
                                    <el-input v-model="editTransferForm.bank_branch" :placeholder="$t('home.enterBankBranch')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankAccount')" prop="card_number">
                                    <el-input v-model="editTransferForm.card_number" :placeholder="$t('home.enterBankAccount')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankSwift')" prop="swift_code">
                                    <el-input v-model="editTransferForm.swift_code" :placeholder="$t('home.enterBankSwift')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankIban')" prop="iban_code">
                                    <el-input v-model="editTransferForm.iban_code" :placeholder="$t('home.enterBankIban')"></el-input>
                                </el-form-item> 
                                <el-form-item :label="$t('home.sortCode')" prop="sort_code">
                                    <el-input v-model="editTransferForm.sort_code" :placeholder="$t('home.enterSortCode')"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                </div>
                <div style="text-align: right;">
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="handleClose">{{$t('button.cancle')}}</el-button>
                        <el-button type="primary" @click="editSubmit">{{$t('button.confirm')}}</el-button>
                    </span>
                </div>
            </div>
        </el-dialog>
        <!-- dialog 余额变动记录 -->
		<el-dialog title="" :visible.sync="recordVisible" width="90%" :before-close="recordClose" custom-class="recordDialog">
			<div class="recordTitle" slot="title">
                <span style="display: inline-block;">
                    <el-input v-model="recordKeyword" :placeholder="$t('placeholder.enterKeyword')" @keyup.native.enter="reloadRecordList"></el-input>
                </span>
				<el-date-picker v-model="dateValue" @change="changeDate" type="daterange" align="right" unlink-panels :range-separator="$t('button.to')" :start-placeholder="$t('button.startDate')" :end-placeholder="$t('button.endDate')" value-format="yyyy-MM-dd" style="margin-left: 10px;"></el-date-picker>
			</div>
			<div class="dialogContent" v-loading="recordLoading">
                <div class="historySum" v-for="(item,index) in countData" :key="index">
                    <span :style="{fontSize: '12px'}" :class="{sumLabelFont: index == 0 ? false : true}">{{item.label}}</span><span class="sumNumberFont">{{item.value}}</span>
                </div>
				<el-table :data="recordTable" ref="recordTable" style="width: 100%" stripe border height="430">
                    <el-table-column v-for="(item,index) in recordTableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width"></el-table-column>
                </el-table>
                <div class="recordPage">
                    <el-pagination
                        @size-change="recordSizeChange"
                        @current-change="recordCurrentChange"
                        :current-page="recordCurrentPage"
                        :page-sizes="[10,15,20,30 ,50,100,200]"
                        :page-size="recordPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="recordTotal">
                    </el-pagination>
                </div>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import { transferCheckList ,transferSubmit, transferReject } from "@/api/money/money"
import { getBalanceRecord } from "@/api/user/user"
import { exportExcelMethod , copyArr } from '@/utils/exportExcel'
export default {
    name:'transferCheck',
      data() {
        return {
            tableData: [],
            tableHead: [
                { propName: 'LOGIN',labelName: this.$t('home.accountNumber'),width: '130',isShow: true },
                { propName: 'LOGIN_HOLDER',labelName: this.$t('home.holderName'),width: '110',isShow: true },
                { propName: 'TRANSFER_IN_ACCOUNT',labelName: this.$t('home.rollinAccount'),width: '100',isShow: true },
                { propName: 'AMOUNT',labelName: this.$t('home.transferAmount'),width: '100',isShow: true },
                { propName: 'UPDATE_REASON',labelName: this.$t('home.updateReason'),width: '100',isShow: true },
                { propName: 'COMMENT',labelName: this.$t('home.comment'),width: '100',isShow: true },
                { propName: 'STATUS',labelName: this.$t('home.status'),width: '90',isShow: true },
                { propName: 'CREATE_TIME',labelName: this.$t('home.regDate'),width: '150',isShow: true },
                { propName: 'UPDATE_TIME',labelName: this.$t('other.updateTime'),width: '150',isShow: false }
            ],
            currentPage: 1,
            pageSize: 15,
            total: 0,
            userTableHeight: 0,
            withdrawStatus: '',
            statusOptions: [
                {
                    label: this.$t('home.inHand'),
                    value: 0
                },
                {
                    label: this.$t('home.figureOut'),
                    value: 1
                },
                {
                    label: this.$t('home.rejected'),
                    value: 2
                },
                {
                    label: this.$t('home.canceled'),
                    value: 3
                }
            ],
            keyWord: '',
            checkLoading: false,
            confirmLoading: false,
            cancleLoading: false,
            editVisible: false,
            editTransferForm: '',
            editTransferForm: {
                withdrawId: '',
                currency: '',
                amount: '',
                bank_name: '',
                bank_province: '',
                bank_city: '',
                bank_branch: '',
                card_number: '',
                swift_code: '',
                iban_code: '',
                sort_code: '',
                charge: ''
            },
            login_holder: '',
            username: '',
            full_name: '',
            currencyOptions: [
                {
                    label: 'USD($)',
                    value: 1
                }
            ],
            editRules: {
                /* login_holder: [
                    { required: true, message: '输入账户持有者姓名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '输入交易账户号码', trigger: 'blur' }
                ], */
                currency: [
                    { required: true, message: this.$t('home.selectCurrency'), trigger: 'blur' }
                ],
                amount: [
                    { validator: this.validateAmount,required: true, trigger: 'blur' }
                ],
                charge: [
                    { validator: this.validateCharge,required: true, trigger: 'blur' }
                ],
                /* full_name: [
                    { required: true, message: '收款人姓名', trigger: 'blur' }
                ], */
                bank_name: [
                    { required: true, message: this.$t('home.selectCurrency'), trigger: 'blur' }
                ],
                bank_province: [
                    { required: true, message: this.$t('home.enterPorvince'), trigger: 'blur' }
                ],
                bank_city: [
                    { required: true, message: this.$t('home.enterCity'), trigger: 'blur' }
                ],
                bank_branch: [
                    { required: true, message: this.$t('home.enterBankBranch'), trigger: 'blur' }
                ],
                card_number: [
                    { required: true, message: this.$t('home.enterBankAccount'), trigger: 'blur' }
                ],
                swift_code: [
                    { required: true, message: this.$t('home.enterBankSwift'), trigger: 'blur' }
                ],
                iban_code: [
                    { required: false, message: this.$t('home.enterBankIban'), trigger: 'blur' }
                ],
                sort_code: [
                    { required: false, message: this.$t('home.enterSortCode'), trigger: 'blur' }
                ],
            },
            editLoading: false,
            recordVisible: false,
            recordKeyword: null,
            dateValue: null,
            recordLoading: false,
            recordTable: [],
            recordTableHead: [
                { propName: 'ORDER_ID',labelName: this.$t('table.orderId'),width: '100' },
				{ propName: 'TICKET',labelName: this.$t('table.ticket'),width: '100' },
				{ propName: 'ACCOUNT',labelName: this.$t('table.accountId'),width: '100' },
				{ propName: 'LOGIN',labelName: this.$t('table.account'),width: '80' },
				{ propName: 'OPEN_TIME',labelName: this.$t('table.positionOpentime'),width: '150' },
				{ propName: 'CMD',labelName: this.$t('table.type'),width: '100' },
				{ propName: 'SYMBOL',labelName: this.$t('table.symbol'),width: '100' },
				{ propName: 'VOLUME',labelName: this.$t('indexLang.volume'),width: '100' },
                { propName: 'CLOSE_TIME',labelName: this.$t('table.closeTime'),width: '150' },
                { propName: 'CREATE_TIME',labelName: this.$t('table.createTime'),width: '150' },
				{ propName: 'PROFIT',labelName: this.$t('table.commiss'),width: '100' },
				{ propName: 'COMMENT',labelName: this.$t('table.note'),width: '100' }
            ],
            recordCurrentPage: 1,
            recordPageSize: 15,
            recordTotal: 0,
            currentLogin: null,
            countData: [
                {label: this.$t('other.total') +'：',value: '0'},
                {label: this.$t('other.commissionTotal') +'：',value: '0'},
                {label: this.$t('other.IBAccount') +'：',value: '0'},
                {label: this.$t('other.tradingAccount') +'：',value: '0'},
				{label: this.$t('other.transactionNumber') +'：',value: '0'},
				{label: this.$t('home.balance') +'：',value: '0'}
            ],
            lastChildDate: null,
            exportLoading: false
        }
    },
    computed: {},
    mounted(){
        /* 根据不同屏幕大小设定table高度 */
        this.userTableHeight = window.innerHeight - 315;
        this.reloadTransferList();
    },
    methods: {
        /* 导出excel */
        toReportExcel(){
            let params = {
                keyword: this.keyWord,
                page: 1,
                page_size: this.total,
                status: this.withdrawStatus
            }
            this.exportLoading = true;
            transferCheckList(params).then( v => {
                this.exportLoading - false;
                if(v.code == 0){
                    let tData = v.data.row;
                    if(tData.length > 0){
                        let tDataKeys = [];
                        this.tableHead.map( v => {
                            tDataKeys.push(v.propName);
                        });
                        tDataKeys.push('NEGATIVE_STATUS');
                        tData.forEach( j => {
                            /* 处理当前状态 */
                            switch(j.STATUS){
                                case '0':
                                    j.STATUS = this.$t('home.inHand');
                                    break;
                                case '1':
                                    j.STATUS = this.$t('home.figureOut');
                                    break;
                                case '2':
                                    j.STATUS = this.$t('home.rejected');
                                    break;
                                case '3':
                                    j.STATUS = this.$t('home.canceled');
                                    break;
                            }
                            /* 是否有负值 */
                            if(j.NEGATIVE_STATUS == '1'){
                                let negativeStr = '';
                                j.NEGATIVE_LOGIN.forEach( v => {
                                    negativeStr += v.LOGIN +':'+ v.BALANCE +',';
                                })
                                j.NEGATIVE_STATUS = negativeStr.slice(0,-1);
                            }else{
                                j.NEGATIVE_STATUS = '正';
                            }
                        })
                        exportExcelMethod(tData,tDataKeys,tDataKeys,'transfer-check');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 金额验证 */
        validateAmount(rule, value, callback){
            if(value === ''){
                callback(this.$t('home.enterAmount'));
            }else{
                var ptn = /^\d+(?=\.{0,1}\d+$|$)/;
                var res = ptn.test(value);
                if(!res){
                    callback(this.$t('placeholder.enterCorrectMoney'));
                }else{
                    if(value > Number(this.login_balance)){
                        callback(this.$t('placeholder.lackBalance'));
                    }
                    callback();
                }
            }
        },
        validateCharge(rule, value, callback){
            if(value === ''){
                callback(this.$t('home.enterCharge'));
            }else{
                var ptn = /^\d+(?=\.{0,1}\d+$|$)/;
                var res = ptn.test(value);
                if(!res){
                    callback(this.$t('placeholder.enterCorrectMoney'));
                }else{
                    callback();
                }
            }
        },
        /* 转账申请列表 */
        reloadTransferList(){
            let params = {
                keyword: this.keyWord,
                page: this.currentPage,
                page_size: this.pageSize,
                status: this.withdrawStatus
            }
            this.checkLoading = true;
            transferCheckList(params).then( v => {
                this.checkLoading = false;
                if(v.code == 0){
                    let tData = v.data.row;
                    tData.map( data => {
                        data.affirmBtnLoading = false;
                        data.refuseBtnLoading = false;
                        data.chargeValue = data.CHARGE;
                        //data.CARD_STATUS = 2;
                    })
                    this.tableData = tData;
                    this.total = v.data.total*1;
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        handleSizeChange(v){
            this.currentPage = 1;
            this.pageSize = v;
            this.reloadTransferList();
        },
        handleCurrentChange(v){
            this.currentPage = v;
            this.reloadTransferList();
        },
        /* 管理员 出金申请确认 */
        toSubmitTransfer(row){
            this.$confirm(this.$t('other.confirmTransfer'), this.$t('home.hint'), {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancle'),
                type: 'warning'
            }).then(() => {
                let params = {
                    transfer_id: row.TRANSFER_ID
                }
                row.affirmBtnLoading = true;
                transferSubmit(params).then( v => {
                    row.affirmBtnLoading = false;
                    if(v.code == 0){
                        this.$message({
                            message: this.$t('home.confimApp'),
                            type: 'success'
                        });
                        this.reloadTransferList();
                    }else{
                        this.$message({
                            message: v.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('home.canceled')
                });          
            }); 
        },
        /* 管理员 拒绝出金申请 */
        toRejectTransfer(row){
            this.$prompt(this.$t('home.enterRefuseReason'), this.$t('home.hint'), {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancle'),
            }).then(({ value }) => {
                let params = {
                    transfer_id: row.TRANSFER_ID,
                    reject_reason: value
                }
                row.refuseBtnLoading = true;
                transferReject(params).then( (v) => {
                    row.refuseBtnLoading = false;
                    if(v.code == 0){
                        this.$message({
                            message: this.$t('home.rufuseApp'),
                            type: 'success'
                        });
                        this.reloadTransferList();
                    }else{
                        this.$message({
                            message: v1.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('home.canceled')
                });       
            });
        },
        /* 根据状态筛选出金申请 */
        selectWithdraw(){
            if(!this.withdrawStatus){
                this.tableHead.map( v => {
                    if(v.propName == 'UPDATE_TIME'){
                        v.isShow = false;
                    }
                })
            }else{
                this.tableHead.map( v => {
                    if(v.propName == 'UPDATE_TIME'){
                        v.isShow = true;
                    }
                })
            }
            this.reloadTransferList();
        },
        /* 修改出金申请信息 */
        toEditWithdraw(row){
            this.editVisible = true;
            this.login_holder = row.LOGIN_HOLDER;
            this.username = row.LOGIN;
            this.full_name = row.FULL_NAME;
            this.editTransferForm = {
                withdrawId: row.WITHDRAW_ID,
                currency: row.CURRENCY,
                amount: row.AMOUNT,
                charge: row.CHARGE,
                bank_name: row.BANK_NAME,
                bank_province: row.BANK_PROVINCE,
                bank_city: row.BANK_CITY,
                bank_branch: row.BANK_BRANCH,
                card_number: row.CARD_NUMBER,
                swift_code: row.SWIFT_CODE,
                iban_code: row.IBAN_CODE,
                sort_code: row.SORT_CODE
            }
        },
        /* 关闭修改出金申请 dialog */
        handleClose(){
            this.editVisible = false;
        },
        /* 修改出金申请 提交 */
        editSubmit(){
            this.$refs.editTransferForm.validate( (valid) => {
                if(valid){
                    let params = {
                        withdraw_id: this.editTransferForm.withdrawId,
                        login_holder: this.login_holder,
                        username: this.username,
                        currency: this.editTransferForm.currency,
                        amount: Number(this.editTransferForm.amount),
                        charge: Number(this.editTransferForm.charge),
                        full_name: this.full_name,
                        bank_name: this.editTransferForm.bank_name,
                        bank_province: this.editTransferForm.bank_province,
                        bank_city: this.editTransferForm.bank_city,
                        bank_branch: this.editTransferForm.bank_branch,
                        card_number: this.editTransferForm.card_number,
                        sort_code: this.editTransferForm.sort_code,
                        swift_code: this.editTransferForm.swift_code,
                        iban_code: this.editTransferForm.iban_code
                    }
                    this.editLoading = true;
                    editWithdraw(params).then( v => {
                        this.editLoading = false;
                        if(v.code == 0){
                            this.editVisible = false;
                            this.reloadTransferList();
                            this.$message({
                                message: this.$t('placeholder.editSuccess'),
                                type: 'success'
                            })
                        }else{
                            this.$message({
                                message: v.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            })
        },
        /* 查看当前点击账户的信息 dialog */
        showBalanceRecord(row){
            this.recordVisible = true;
            this.currentLogin = row.LOGIN;
            this.reloadRecordList();
        },
        /* 关闭余额变动记录 dialog */
        recordClose(){
            this.recordVisible = false;
        },
        changeDate(){
            if(this.dateValue == this.lastChildDate){
                return;
            }else{
                this.lastChildDate = this.dateValue;
                this.reloadRecordList();
            }
        },
        recordSizeChange(v){
            this.recordCurrentPage = 1;
            this.recordPageSize = v;
            this.reloadRecordList();
        },
        recordCurrentChange(v){
            this.recordCurrentPage = v;
            this.reloadRecordList();
        },
        reloadRecordList(){
            let params = {
                login: this.currentLogin,
                keyword: this.recordKeyword,
				page: this.recordCurrentPage,
				page_size: this.recordPageSize
			}
			if(this.dateValue && this.dateValue.length > 0){
				params.start_time_format = this.dateValue[0];
				params.end_time_format = this.dateValue[1];
			}
			this.recordLoading = true;
			this.recordTable = [];
			getBalanceRecord(params).then( data => {
                this.recordLoading = false;
                let statistic = data.data.statistic;
				if(data.code == 0){
					let tData = data.data.row;
					tData.map( v => {
						switch(v.CMD){
							case '0':
								v.CMD = 'buy';
								break;
							case '1':
								v.CMD = 'sell';
								break;
							case '8':
								v.CMD = 'withdrawal';
								break;
							case '9':
								v.CMD = 'charge';
								break;
							default:
								v.CMD = '-';
								break;
						}
					})
					this.recordTable = tData;
                    this.recordTotal = data.data.total*1;
                    this.countData[0].value = statistic.count;
                    this.countData[1].value = statistic.profit_all;
                    this.countData[2].value = statistic.account_count;
                    this.countData[3].value = statistic.login_count;
                    this.countData[4].value = statistic.volume_all;
                    this.countData[5].value = statistic.balance;
                }
			})
        },
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.transferCheck{
    .applyPage{
        margin-top: 20px;
        text-align: right;
    }
    .recordPage{
        margin-top: 15px;
    }
    .historySum{
        margin-bottom: 5px;
        display: inline-block;
        .sumLabelFont{
            margin-left: 20px;
            font-size: 12px;
        }
        .sumNumberFont{
            font-weight: bold;
            color: #409EFF;
            font-size: 14px;
        }
    }
    .withdrawCountTip{
        cursor: pointer;
    }
    .countIcon{
        width:22px;
        height:22px;
        display:inline-block;
        background:#00abff;
        vertical-align: middle;
        line-height:22px;
        text-align: center;
        border-radius:10px;
        font-size:12px;
        color: #fff;
        margin-bottom:0px;
    }
    .negative{
        background: #67c23a;
    }
    .warningCharge{
        color: #e6a23c;
    }
    .successCharge{
        color: #67c23a;
    }
}
</style>
<style>
.operation-class{
    cursor: pointer;
}
.operation-class .el-button--mini,.operation-class .el-button--mini.is-round{
    padding: 5px 10px;
    width: 70px;
}
.transferCheck .el-card__header{
    padding: 8px 20px;
    line-height: 40px;
}
.checkKey .el-input{
    width: 217px;
}
.user-tooltip{
	max-width: 20%;
} 
.transferLogin{
    color: #409eff;
}
.transferLogin:hover{
    cursor: pointer;
    text-decoration: underline;
}
.recordDialog .el-dialog__body{
    padding-top: 0px;
    padding-bottom: 20px;
}
.recordDialog .el-dialog__header{
    padding-left: 20px;
    padding-top: 20px;
}
.applyTable .el-icon-my-iconcj{
    font-size: 22px;
    color: #409eff;
    vertical-align: middle;
}
.applyTable .el-icon-my-sh,.applyTable .el-icon-my-weirenzheng,.applyTable .el-icon-my-approve{
    font-size: 20px;
    vertical-align: middle;
}
.chargeEdit{
    width: 140px !important;
}
.chargeEdit .el-input__inner{
    height: 23px !important;
}
.chargeEdit .el-input__icon{
    line-height: 23px;
}
.iconEdit:hover{
    cursor: pointer;
    color: #409eff;
}
.warningCharge .el-input__inner{
    color: #e6a23c;
}
.successCharge .el-input__inner{
    color: #67c23a;
}
.applyTable .el-pagination--small .arrow.disabled,.applyTable .el-table .hidden-columns,.applyTable .el-table td.is-hidden>*,.applyTable .el-table th.is-hidden>*,.applyTable .el-table--hidden{
    visibility:visible !important;
}
</style>

