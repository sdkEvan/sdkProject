<template>
    <div class="transferApply">
        <div class="glodApply">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{this.$t('home.transferApply')}}</span>
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
                                <!-- <el-form-item :label="$t('home.payeeName')" prop="full_name">
                                    <el-input v-model="full_name" :placeholder="$t('home.enterPayeeName')" disabled></el-input>
                                </el-form-item> -->
                                <el-form-item :label="$t('home.rollinAccount')" prop="rollinAccount">
                                    <el-input v-model="applyForm.rollinAccount" :placeholder="$t('home.enterRollinAccount')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('home.transferAmount')" prop="amount">
                                    <el-input v-model="applyForm.amount" :placeholder="$t('home.enterTransfer')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.currency')" prop="currency">
                                    <el-select v-model="applyForm.currency" clearable :placeholder="$t('home.selectCurrency')">
                                        <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('home.comment')" prop="comment">
                                    <el-input v-model="applyForm.comment" :placeholder="$t('home.enterComment')"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <div class="applySubmit">
                        <!-- <el-checkbox v-model="defaultInfo" :label="$t('home.setDefaultWithdraw')" border></el-checkbox> -->
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
                    <el-select v-model="transferStatus" @change="selectWithdraw" clearable style="float: right;" :placeholder="$t('home.selectAppStatus')">
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
import { transferRequest , transferList } from "@/api/money/money"
export default {
    name:'transferApply',
      data() {
        return {
            applyForm: {
                currency: '',
                rollinAccount: '',
                amount: '',
                comment: ''
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
            transferStatus: '',
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
                rollinAccount: [
                    { validator: this.validateRollinAccount,required: true, trigger: 'blur' }
                ],
                currency: [
                    { required: true, message: this.$t('home.selectCurrency'), trigger: 'blur' }
                ],
                amount: [
                    { validator: this.validateAmount,required: true, trigger: 'blur' }
                ],
                comment: [
                    { validator: this.validateComment,required: false, trigger: 'blur' }
                ]
            },
            defaultInfo: 0,
            tableData: [],
            tableHead: [
                { propName: 'LOGIN',labelName: this.$t('home.accountNumber'),width: '130' },
                { propName: 'LOGIN_HOLDER',labelName: this.$t('home.holderName'),width: '110' },
                { propName: 'TRANSFER_IN_ACCOUNT',labelName: this.$t('home.rollinAccount'),width: '100' },
                { propName: 'AMOUNT',labelName: this.$t('home.transferAmount'),width: '100' },
                { propName: 'UPDATE_REASON',labelName: this.$t('home.updateReason'),width: '100' },
                { propName: 'COMMENT',labelName: this.$t('home.comment'),width: '100' },
                { propName: 'STATUS',labelName: this.$t('home.status'),width: '90' },
                { propName: 'CREATE_TIME',labelName: this.$t('home.regDate'),width: '150' }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            applyTableLoading: false,
            submitLoading: false
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
        this.reloadTransferList();
    },
    methods: {
        /* 金额验证 */
        validateAmount(rule, value, callback){
            if(value === ''){
                callback(this.$t('home.enterTransfer'));
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
        /* 备注验证 */
        validateComment(rule, value, callback){
            if(value){
                let ptn = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                let res = ptn.test(value);
                if(!res){
                    callback(this.$t('placeholder.enterCorrectComment'));
                }else{ 
                    callback();
                }
            }else{
                callback();
            }
        },
        /* 转入账号验证 */
        validateRollinAccount(rule, value, callback){
            if(value === ''){
                callback(this.$t('home.enterRollinAccount'));
            }else{
                var ptn = /^\d{0,10}$/;
                var res = ptn.test(value);
                if(!res){
                    callback(this.$t('home.enterCorrectRollin'));
                }else{
                    callback();
                }
            }
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
                        transfer_in_account: this.applyForm.rollinAccount,
                        amount: Number(this.applyForm.amount),
                        comment: this.applyForm.comment
                    }
                    this.submitLoading = true;
                    transferRequest(params).then( v => {
                        this.submitLoading = false;
                        if(v.code == 0){
                            this.resetForm('applyForm');
                            this.reloadTransferList();
                            this.$message({
                                message: this.$t('other.transferSuccess'),
                                type: 'success'
                            });
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
        /* 转账申请列表 */
        reloadTransferList(){
            let params = {
                page: this.currentPage,
                page_size: this.pageSize,
                status: this.transferStatus
            }
            this.applyTableLoading = true;
            transferList(params).then( v => {
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
            this.reloadTransferList();
        },
        handleSizeChange(v){
            this.$nextTick( () => {
                this.scrollToBottom();
            })
            this.currentPage = 1;
            this.pageSize = v;
            this.reloadTransferList();
        },
        handleCurrentChange(v){
            this.currentPage = v;
            this.reloadTransferList();
        },
        scrollToBottom(){
            //$('.routerView').scrollTop($('.routerView')[0].scrollHeight);
            $('.routerView').scrollTop(610);
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.transferApply{
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
    padding: 5px 5px 5px 15px;
    border-radius: 10px;
    font-size: 12px;
}
.sortCodeItem{
    margin-bottom: 10px;
}
</style>

