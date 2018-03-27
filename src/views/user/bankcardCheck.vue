<template>
    <div class="bankcardCheck">
        <el-card class="box-card">
            <div slot="header" class="bankcardCheckTitle">
                <span>{{$t('other.bankcardCheck')}}</span>
                <el-select v-model="bankcardStatus" @change="selectBankcard" clearable style="float: right;" :placeholder="$t('home.selectAppStatus')">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="checkKey">
                    <el-input v-model="keyWord" :placeholder="$t('placeholder.enterKeyword')" style="margin-right:5px;float: right;" @keyup.native.enter="reloadBankcardList"></el-input>
                </span>
            </div>
            <div class="applyTable" v-loading="checkLoading">
                <el-table :data="tableData" ref="bankcardList" style="width: 100%" stripe border :height="userTableHeight">
                    <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="item.propName == 'STATUS'">
                                <span v-show="scope.row.VERIFY_STATUS === '0'">
                                    <el-tag size="small">{{$t('other.noChecked')}}</el-tag>
                                </span>
                                <span v-show="scope.row.VERIFY_STATUS === '1'">
                                    <el-tag type="success" size="small">{{$t('other.checked')}}</el-tag>
                                </span>
                                <span v-show="scope.row.VERIFY_STATUS === '2'">
                                    <el-tag  type="danger" size="small">{{$t('other.refused')}}</el-tag>
                                </span>
                            </span>
                            <span v-else>{{scope.row[item.propName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="operation-class" :label="$t('table.operate')" :min-width="250" fixed="right">
                        <template slot-scope="scope">
                            <span @click="toeditBackcard(scope.row)">
                                <el-button size="mini">{{$t('button.edit')}}</el-button>
                            </span>
                            <span @click="toVerifyBankcard(scope.row,'1')">
                                <el-button type="primary" size="mini" :loading="scope.row.affirmBtnLoading">{{$t('button.affirm')}}</el-button>
                            </span>
                            <span @click="toVerifyBankcard(scope.row,'2')">
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
        <!-- 修改出金银行卡信息 dialog -->
        <el-dialog :title="$t('dialog.editBankcardInfo')" :visible.sync="editVisible" width="80%" :before-close="handleClose" top="12vh">
            <div v-loading="editLoading">
                <div class="editBackcard">
                    <el-row :gutter="15">
                        <el-form :model="editBackcardForm" label-width="150px" ref="editBackcardForm" :rules="editRules">
                            <el-col :span="12">
                                <el-form-item :label="$t('home.holderName')" prop="login_holder">
                                    <el-input v-model="login_holder" :placeholder="$t('home.enterHolderName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.accountNumber')" prop="username">
                                    <el-input v-model="username" :placeholder="$t('home.enterAccountNumber')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.currency')" prop="currency" class="editBackcardSele">
                                    <el-select v-model="editBackcardForm.currency" clearable :placeholder="$t('home.selectCurrency')">
                                        <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('home.payeeName')" prop="full_name">
                                    <el-input v-model="full_name" :placeholder="$t('home.enterPayeeName')" disabled></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankName')" prop="bank_name">
                                    <el-input v-model="editBackcardForm.bank_name" :placeholder="$t('home.enterBankName')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.province')" prop="bank_province">
                                    <el-input v-model="editBackcardForm.bank_province" :placeholder="$t('home.enterPorvince')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('home.city')" prop="bank_city">
                                    <el-input v-model="editBackcardForm.bank_city" :placeholder="$t('home.enterCity')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankBranch')" prop="bank_branch">
                                    <el-input v-model="editBackcardForm.bank_branch" :placeholder="$t('home.enterBankBranch')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankAccount')" prop="card_number">
                                    <el-input v-model="editBackcardForm.card_number" :placeholder="$t('home.enterBankAccount')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankSwift')" prop="swift_code">
                                    <el-input v-model="editBackcardForm.swift_code" :placeholder="$t('home.enterBankSwift')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.bankIban')" prop="iban_code">
                                    <el-input v-model="editBackcardForm.iban_code" :placeholder="$t('home.enterBankIban')"></el-input>
                                </el-form-item> 
                                <el-form-item :label="$t('home.sortCode')" prop="sort_code">
                                    <el-input v-model="editBackcardForm.sort_code" :placeholder="$t('home.enterSortCode')"></el-input>
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
    </div>
</template>
<script>
import { getWithdrawCardList } from "@/api/money/money"
import { getNewBalance , verifyCardInfo , editCardInfo } from "@/api/user/user"
export default {
    name:'bankcardCheck',
      data() {
        return {
            tableData: [],
            tableHead: [
                { propName: 'STATUS',labelName: this.$t('home.status'),width: '90' },
                { propName: 'LOGIN',labelName: this.$t('home.accountNumber'),width: '130' },
                { propName: 'LOGIN_HOLDER',labelName: this.$t('home.holderName'),width: '110' },
                { propName: 'FULL_NAME',labelName: this.$t('home.payeeName'),width: '100' },
                { propName: 'BANK_PROVINCE',labelName: this.$t('home.province'),width: '100' },
                { propName: 'BANK_CITY',labelName: this.$t('home.city'),width: '100' },
                { propName: 'BANK_NAME',labelName: this.$t('home.bankName'),width: '120' },
                { propName: 'BANK_BRANCH',labelName: this.$t('home.bankBranch'),width: '120' },
                { propName: 'CARD_NUMBER',labelName: this.$t('home.bankAccount'),width: '120' },
                { propName: 'CREATE_TIME',labelName: this.$t('home.regDate'),width: '150' }
            ],
            currentPage: 1,
            pageSize: 15,
            total: 0,
            userTableHeight: 0,
            bankcardStatus: '',
           /*  0 未验证  1 已验证  2 已拒绝 */
            statusOptions: [
                {
                    label: this.$t('other.noChecked'),
                    value: 0
                },
                {
                    label: this.$t('other.checked'),
                    value: 1
                },
                {
                    label: this.$t('other.refused'),
                    value: 2
                }
            ],
            keyWord: '',
            checkLoading: false,
            confirmLoading: false,
            cancleLoading: false,
            editVisible: false,
            editBackcardForm: '',
            editBackcardForm: {
                bankcardId: '',
                currency: '',
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
            editRules: {
                currency: [
                    { required: true, message: this.$t('home.selectCurrency'), trigger: 'blur' }
                ],
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
            editLoading: false
        }
    },
    computed: {

    },
    mounted(){
        /* 根据不同屏幕大小设定table高度 */
        this.userTableHeight = window.innerHeight - 315;
        this.reloadBankcardList();
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
        /* 银行卡信息列表 */
        reloadBankcardList(){
            let params = {
                keyword: this.keyWord,
                page: this.currentPage,
                page_size: this.pageSize,
                status: this.bankcardStatus
            }
            this.checkLoading = true;
            getWithdrawCardList(params).then( v => {
                this.checkLoading = false;
                if(v.code == 0){
                    let tData = v.data.row;
                    tData.map( data => {
                        data.affirmBtnLoading = false;
                        data.refuseBtnLoading = false;
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
            this.reloadBankcardList();
        },
        handleCurrentChange(v){
            this.currentPage = v;
            this.reloadBankcardList();
        },
        /* 管理员 银行卡信息确认 */
        toVerifyBankcard(row,status){
            this.$confirm(status == '1' ? this.$t('other.confirmBankcardInfo') : this.$t('other.confirmRefuse'), this.$t('home.hint'), {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancle'),
                type: 'warning'
            }).then(() => {
                let params = {
                    WITHDRAW_DEFAULT_ID: row.WITHDRAW_DEFAULT_ID,
                    VERIFY_STATUS: status
                }
                if(status == '1'){
                    row.affirmBtnLoading = true;
                }else{
                    row.refuseBtnLoading = true;
                }
                verifyCardInfo(params).then( v => {
                    if(status == '1'){
                        row.affirmBtnLoading = false;
                    }else{
                        row.refuseBtnLoading = false;
                    }
                    if(v.code == 0){
                        this.$message({
                            message: status == '1' ? this.$t('other.confirmSuccess') : this.$t('other.refused'),
                            type: 'success'
                        });
                        this.reloadBankcardList();
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
        /* 管理员 拒绝银行卡信息 */
        /* toVerifyBankcard(row){
            this.$prompt(this.$t('home.enterRefuseReason'), this.$t('home.hint'), {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancle'),
            }).then(({ value }) => {
                let params = {
                    bankcard_id: row.bankcard_ID,
                    reject_reason: value
                }
                row.refuseBtnLoading = true;
                bankcardReject(params).then( (v) => {
                    row.refuseBtnLoading = false;
                    if(v.code == 0){
                        this.$message({
                            message: this.$t('home.rufuseApp'),
                            type: 'success'
                        });
                        this.reloadBankcardList();
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
        }, */
        /* 根据状态筛选银行卡信息 */
        selectBankcard(){
            this.reloadBankcardList();
        },
        /* 修改银行卡信息信息 */
        toeditBackcard(row){
            this.editVisible = true;
            this.login_holder = row.LOGIN_HOLDER;
            this.username = row.LOGIN;
            this.full_name = row.FULL_NAME;
            this.editBackcardForm = {
                bankcardId: row.WITHDRAW_DEFAULT_ID,
                currency: row.CURRENCY,
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
        /* 关闭修改银行卡信息 dialog */
        handleClose(){
            this.editVisible = false;
        },
        /* 修改银行卡信息 提交 */
        editSubmit(){
            this.$refs.editBackcardForm.validate( (valid) => {
                if(valid){
                    let params = {
                        WITHDRAW_DEFAULT_ID: this.editBackcardForm.bankcardId,
                        login: this.username,
                        login_holder: this.login_holder,
                        currency: this.editBackcardForm.currency,
                        full_name: this.full_name,
                        bank_name: this.editBackcardForm.bank_name,
                        bank_province: this.editBackcardForm.bank_province,
                        bank_city: this.editBackcardForm.bank_city,
                        bank_branch: this.editBackcardForm.bank_branch,
                        card_number: this.editBackcardForm.card_number,
                        sort_code: this.editBackcardForm.sort_code,
                        swift_code: this.editBackcardForm.swift_code,
                        iban_code: this.editBackcardForm.iban_code,
                    }
                    this.editLoading = true;
                    editCardInfo(params).then( v => {
                        this.editLoading = false;
                        if(v.code == 0){
                            this.editVisible = false;
                            this.reloadBankcardList();
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
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.bankcardCheck{
    .applyPage{
        margin-top: 20px;
        text-align: right;
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
.bankcardCheck .el-card__header{
    padding: 8px 20px;
    line-height: 40px;
}
.checkKey .el-input{
    width: 217px;
}
.user-tooltip{
	max-width: 20%;
} 
.holder-class{
    color: #409eff;
}
.holder-class:hover{
    cursor: pointer;
    text-decoration: underline;
}
</style>

