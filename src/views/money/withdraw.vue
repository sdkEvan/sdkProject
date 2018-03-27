<template>
    <div class="withdraw">
        <div class="glodApply">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{this.$t('home.withDraw')}}</span>
                </div>
                <div class="applyForm">
                    <el-row :gutter="15">
                        <el-form :model="applyForm" label-width="150px" ref="applyForm" :rules="applyRules">
                            <el-col :span="12">
                                <el-form-item :label="$t('home.holderName')" prop="login_holder">
                                    <el-input v-model="login_holder" :placeholder="$t('home.enterHolderName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.accountNumber')" prop="username">
                                    <el-input v-model="username" :placeholder="$t('home.enterAccountNumber')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.currency')" prop="currency">
                                    <el-select v-model="applyForm.currency" clearable :placeholder="$t('home.selectCurrency')">
                                        <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('home.amount')" prop="amount">
                                    <el-input v-model="applyForm.amount" :placeholder="$t('home.enterAmount')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.payeeName')" prop="full_name">
                                    <el-input v-model="full_name" :placeholder="$t('home.enterPayeeName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankName')" prop="bank_name">
                                    <el-input v-model="applyForm.bank_name" :placeholder="$t('home.enterBankName')"></el-input>
                                        <!-- <div>温馨提示：银行账户姓名应于SVSFX交易账户姓名一致；
                                        当月第一笔银联出金免费,再次申请银联出金则每次收取10美金手续费。</div> -->
                                </el-form-item>
                                <el-form-item :label="$t('home.province')" prop="bank_province">
                                    <el-input v-model="applyForm.bank_province" :placeholder="$t('home.enterPorvince')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('home.city')" prop="bank_city">
                                    <el-input v-model="applyForm.bank_city" :placeholder="$t('home.enterCity')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankBranch')" prop="bank_branch">
                                    <el-input v-model="applyForm.bank_branch" :placeholder="$t('home.enterBankBranch')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankAccount')" prop="card_number">
                                    <el-input v-model="applyForm.card_number" :placeholder="$t('home.enterBankAccount')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankSwift')" prop="swift_code">
                                    <el-input v-model="applyForm.swift_code" :placeholder="$t('home.enterBankSwift')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankIban')" prop="iban_code">
                                    <el-input v-model="applyForm.iban_code" :placeholder="$t('home.enterBankIban')"></el-input>
                                </el-form-item> 
                                <el-form-item :label="$t('home.sortCode')" prop="sort_code" class="sortCodeItem">
                                    <el-input v-model="applyForm.sort_code" :placeholder="$t('home.enterSortCode')"></el-input>
                                </el-form-item>
                                <el-form-item class="friendShip">
                                    温馨提示：
                                    <div>① 当月第一笔银联出金免费,再次申请银联出金则每次收取（<span class="chargeNumber">$&nbsp;20</span>）手续费；</div>
                                    <div>② 本次出金预计手续费：<span class="chargeNumber">$&nbsp;{{predictCharge}}</span><span style="font-size: 12px;">（仅供参考）</span>。</div>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <div class="applySubmit">
                        <el-checkbox v-model="defaultInfo" :label="$t('home.setDefaultWithdraw')" border></el-checkbox>
                        <el-button @click="resetForm('applyForm')">{{$t('home.reset')}}</el-button>
                        <el-button type="primary" :loading="submitLoading" @click="applySubmit">{{$t('home.submit')}}</el-button>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="applyInfo">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{$t('home.ApplicationInfo')}}</span>
                    <el-select v-model="withdrawStatus" @change="selectWithdraw" clearable style="float: right;" :placeholder="$t('home.selectAppStatus')">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="applyTable" v-loading="applyTableLoading">
                    <el-table :data="tableData" style="width: 100%" stripe border>
                        <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="item.propName == 'STATUS'">
                                    <span v-show="scope.row.STATUS === '0'">
                                        <el-tag size="small">{{$t('home.inHand')}}</el-tag>
                                    </span>
                                    <span v-show="scope.row.STATUS === '1'">
                                        <el-tag  type="success" size="small">{{$t('home.figureOut')}}</el-tag>
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
                                <span v-else>{{scope.row[item.propName]}}</span>
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
        </div>
    </div>
</template>
<script>
import { addWithdrawInfo , withdrawList , withdrawDefault , getCharge } from "@/api/money/money"
export default {
    name:'withdraw',
      data() {
        return {
            applyForm: {
                login_holder: '',
                username: '',
                currency: '',
                amount: '',
                bank_name: '',
                bank_province: '',
                bank_city: '',
                bank_branch: '',
                card_number: '',
                swift_code: '',
                iban_code: '',
                sort_code: ''
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
            applyRules: {
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
            defaultInfo: 0,
            tableData: [],
            tableHead: [
                { propName: 'LOGIN',labelName: this.$t('home.accountNumber'),width: '130' },
                { propName: 'LOGIN_HOLDER',labelName: this.$t('home.holderName'),width: '110' },
                { propName: 'FULL_NAME',labelName: this.$t('home.payeeName'),width: '100' },
                { propName: 'AMOUNT',labelName: this.$t('home.amount'),width: '100' },
                { propName: 'CHARGE',labelName: this.$t('home.charge'),width: '100' },
                { propName: 'BANK_PROVINCE',labelName: this.$t('home.province'),width: '100' },
                { propName: 'BANK_CITY',labelName: this.$t('home.city'),width: '100' },
                { propName: 'BANK_NAME',labelName: this.$t('home.bankName'),width: '120' },
                { propName: 'BANK_BRANCH',labelName: this.$t('home.bankBranch'),width: '120' },
                { propName: 'CARD_NUMBER',labelName: this.$t('home.bankAccount'),width: '120' },
                { propName: 'STATUS',labelName: this.$t('home.status'),width: '90' },
                { propName: 'CREATE_TIME',labelName: this.$t('home.regDate'),width: '150' }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            applyTableLoading: false,
            submitLoading: false,
            predictCharge: 0
        }
    },
    computed: {
        userInfo(){
            return JSON.parse(sessionStorage.getItem('user_info'));
        },
        /* 记录登录用户的余额 */
        login_balance(){
            let userSession = JSON.parse(sessionStorage.getItem('user_info'));
            return userSession.BALANCE;
        }
    },
    mounted(){
        this.login_holder = this.userInfo.NAME;
        this.username = this.userInfo.LOGIN;
        this.full_name = this.userInfo.NAME_CN;
        this.reloadWithdrawList();
        this.getDefaultWithdraw();
        this.getChargeInfo();
    },
    methods: {
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
                    }else{
                        callback();
                    }
                }
            }
        },
        getChargeInfo(){
            getCharge().then( v => {
                this.predictCharge = v.data.charge;
            })
        },
        /* 重置表单 */
        resetForm(formName) {
            $('.routerView').scrollTop(0);
            this.$refs[formName].resetFields();
        },
        /* 提交表单 */
        applySubmit(){
            if(!this.full_name){
                this.$message({
                    message: this.$t('home.addCnName'),
                    type: 'warning'
                })
                return;
            }
            this.$refs.applyForm.validate( (valid) => {
                if(valid){
                    let params = {
                        login_holder: this.login_holder,
                        username: this.username,
                        currency: this.applyForm.currency,
                        amount: Number(this.applyForm.amount),
                        full_name: this.full_name,
                        bank_name: this.applyForm.bank_name,
                        bank_province: this.applyForm.bank_province,
                        bank_city: this.applyForm.bank_city,
                        bank_branch: this.applyForm.bank_branch,
                        card_number: this.applyForm.card_number,
                        sort_code: this.applyForm.sort_code,
                        swift_code: this.applyForm.swift_code,
                        iban_code: this.applyForm.iban_code,
                        default: Number(this.defaultInfo)
                    }
                    this.submitLoading = true;
                    addWithdrawInfo(params).then( v => {
                        this.submitLoading = false;
                        if(v.code == '100000'){
                            this.$message({
                                message: this.$t('home.noBalance'),
                                type: 'warning'
                            });
                        }else if(v.code == '100002'){
                            this.$message({
                                message: this.$t('home.unfinished'),
                                type: 'warning'
                            });
                        }else if(v.code == 0){
                            this.$message({
                                message: this.$t('home.withdrawSuccess'),
                                type: 'success'
                            });
                            this.scrollToBottom();
                            this.reloadWithdrawList();
                        }else{
                            this.$message({
                                message: v.msg,
                                type: 'warning'
                            });
                        }
                    })
                }
            })
        },
        /* 获取该用户默认出金信息 */
        getDefaultWithdraw(){
            withdrawDefault().then( v => {
                if(v.code == 0){
                    let tData = v.data.row[0];
                    this.applyForm.currency = tData.CURRENCY;
                    this.applyForm.bank_name = tData.BANK_NAME;
                    this.applyForm.bank_province = tData.BANK_PROVINCE;
                    this.applyForm.bank_city = tData.BANK_CITY;
                    this.applyForm.bank_branch = tData.BANK_BRANCH;
                    this.applyForm.card_number = tData.CARD_NUMBER;
                    this.applyForm.swift_code = tData.SWIFT_CODE;
                    this.applyForm.iban_code = tData.IBAN_CODE;
                    this.applyForm.sort_code = tData.SORT_CODE;
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 出金申请列表 */
        reloadWithdrawList(){
            let params = {
                page: this.currentPage,
                page_size: this.pageSize,
                status: this.withdrawStatus
            }
            this.applyTableLoading = true;
            withdrawList(params).then( v => {
                this.applyTableLoading = false;
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
        selectWithdraw(){
            this.scrollToBottom();
            this.reloadWithdrawList();
        },
        handleSizeChange(v){
            this.$nextTick( () => {
                this.scrollToBottom();
            })
            this.currentPage = 1;
            this.pageSize = v;
            this.reloadWithdrawList();
        },
        handleCurrentChange(v){
            this.currentPage = v;
            this.reloadWithdrawList();
        },
        scrollToBottom(){
            //$('.routerView').scrollTop($('.routerView')[0].scrollHeight);
            $('.routerView').scrollTop(610);
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.withdraw{
    height: 100%;
    /* overflow: auto; */
    .applyForm{
        .applySubmit{
            text-align: right;
            padding-top: 15px;
        }
        /* .chargeNumber{
            color: red;
        } */
    }
    .applyInfo{
        margin-top: 20px;
        margin-bottom: 20px;
        .applyPage{
            margin-top: 20px;
            text-align: right;
        }
    }
}
</style>
<style>
.applyForm .el-select{
    width: 100%;
}
.applySubmit .el-button+.el-button{
    margin-left: 0px;
}
/* .applyTable .el-table tr{
    cursor: pointer;
} */
.applyInfo .el-card__header{
    padding: 8px 20px;
    line-height: 40px;
}
.user-tooltip{
	max-width: 20%;
} 
.friendShip .el-form-item__content{
    margin-left: 0px !important;
    line-height: 15px;
    /* background: #d8dce5; */
    color: #bbb;
    padding: 0px 5px 5px 15px;
    border-radius: 10px;
    font-size: 12px;
}
/* .sortCodeItem{
    margin-bottom: 10px !important;
} */
</style>

