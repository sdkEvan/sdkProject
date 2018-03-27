<template>
    <div class="rebateHistory">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;{{$t('home.rebateHistory')}}</span>
                        </el-col>
                        <el-col :span="18" class="search">
                            <el-input :placeholder="$t('placeholder.enterKeyword')" v-model="search"
                            @keyup.native.enter="toFindList">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-date-picker v-model="dateValue" @change="changeDate" type="daterange" align="right" unlink-panels :range-separator="$t('button.to')" :start-placeholder="$t('button.startDate')" :end-placeholder="$t('button.endDate')" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div class="historyList" ref="historyList" v-loading="loading">
                <div class="hostoryCount">
                    <span>
                        <el-button type="primary" size="mini" @click="toAddDialog" icon="el-icon-plus">{{$t('button.add')}}</el-button>
                    </span>
                    <div class="historySum" v-for="(item,index) in countData" :key="index">
                        <span class="sumLabelFont">{{item.label}}</span><span class="sumNumberFont">{{item.value}}</span>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%" stripe border :height="userTableHeight">
                    <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width" show-overflow-tooltip></el-table-column>
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
            </div>
        </el-card>
        <!-- 添加佣金信息 -->
        <el-dialog :title="$t('other.addRebate')" :visible.sync="addVisible" width="70%" :before-close="handleClose" custom-class="addRebateDialog">
            <el-row :gutter="20" class="add-form">
                <el-form ref="addRebateForm" :model="addRebateForm" label-width="100px" :rules="addRebateRules">
                    <el-col :span="11" class="rebateLeftform">
                        <el-form-item :label="$t('table.ticket')" prop="ticket">
                            <el-input v-model="addRebateForm.ticket" :placeholder="$t('other.enterTicket')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.accountId')" prop="account">
                            <el-input v-model="addRebateForm.account" :placeholder="$t('other.enterAccount')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.tradingAccount')" prop="login">
                            <el-input v-model="addRebateForm.login" :placeholder="$t('other.enterLogin')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.symbol')" prop="symbol">
                            <el-input v-model="addRebateForm.symbol" :placeholder="$t('other.enterSymbol')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.clientGroup')" prop="group">
                            <el-select v-model="addRebateForm.group" clearable :placeholder="$t('other.selectClientGroup')" filterable>
                                <el-option v-for="(item,index) in groupOptions" :key="index" :label="item.label" :value="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="13" class="rebateRightform">
                        <el-form-item :label="$t('table.type')" prop="cmd">
                            <el-select v-model="addRebateForm.cmd" clearable :placeholder="$t('other.selectType')">
                                <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('indexLang.volume')" prop="volume">
                            <el-input v-model="addRebateForm.volume" :placeholder="$t('placeholder.enterUsername')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.positionOpentime')" prop="open_time">
                            <el-date-picker v-model="addRebateForm.open_time" type="datetime" :placeholder="$t('other.selectDatetime')" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('table.closeTime')" prop="close_time">
                            <el-date-picker v-model="addRebateForm.close_time" type="datetime" :placeholder="$t('other.selectDatetime')" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('table.commiss')" prop="profit">
                            <el-input v-model="addRebateForm.profit" :placeholder="$t('other.enterProfit')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">{{$t('button.cancle')}}</el-button>
                <el-button type="primary" @click="submitRebate" :loading="submitLoading">{{$t('button.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { rebateHistoryInfo , insertRebate , getCmdType } from "@/api/user/user"
import { getUsdGroup } from "../../api/setting/rebateSetting"
import { GMTToDate , strToGMT , getNowDate , getFirstDate , getTimestamp ,getNormalDate } from "@/utils/utils"
export default {
    name:'rebateHistory',
      data() {
        return {
            search: '',
            tableData: [],
            loading: false,
            total: 0,
            currentPage: 1,
            tablePageSize: 20,
            dateValue: null,
            lastDate: null,
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
            tableHead: [
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
				{ propName: 'COMMENT',labelName: this.$t('table.note'),width: '100' },
            ],
            userTableHeight: 0,
            countData: [
                {label: this.$t('other.total') +'：',value: '0'},
                {label: this.$t('other.commissionTotal') +'：',value: '0'},
                {label: this.$t('other.IBAccount') +'：',value: '0'},
                {label: this.$t('other.tradingAccount') +'：',value: '0'},
                {label: this.$t('other.transactionNumber') +'：',value: '0'}
            ],
            addVisible: false,
            addRebateForm: {
                ticket: '',
                account: '',
                login: '',
                symbol: '',
                group: '',
                cmd: '',
                volume: '',
                open_time: null,
                close_time: null,
                profit: ''
            },
            addRebateRules: {
                ticket: [
                    { required: false, message: this.$t('other.enterTicket'), trigger: 'blur' }
                ],
                account: [
                    { required: true, message: this.$t('other.enterAccount'), trigger: 'blur' }
                ],
                login: [
                    { required: false, message: this.$t('other.enterLogin'), trigger: 'blur' }
                ],
                symbol: [
                    { required: false, message: this.$t('other.enterSymbol'), trigger: 'blur' }
                ],
                group: [
                    { required: false, message: this.$t('other.selectClientGroup'), trigger: 'blur' }
                ],
                cmd: [
                    { required: false, message: this.$t('other.selectCMD'), trigger: 'blur' }
                ],
                volume: [
                    { required: false, message: this.$t('other.enterVolume'), trigger: 'blur' }
                ],
                open_time: [
                    { validator: this.validateOpentime, required: false, trigger: 'blur' }
                ],
                close_time: [
                    { validator: this.validateClosetime, required: false, trigger: 'blur' }
                ],
                profit: [
                    { required: true, message: this.$t('other.enterProfit'), trigger: 'blur' }
                ]
            },
            groupOptions: [],
            typeOptions: [
                {label: 'buy',value: 0},
                {label: 'sell',value: 1},
                {label: 'withdrawal',value: 8},
                {label: 'charge',value: 9}
            ],
            submitLoading: false
        }
    },
    created() {
        /* 初始化时间范围 */
        this.dateValue = [getFirstDate(),getNowDate()];
        this.setCmdTypes();
    },
    mounted(){
        /* 根据不同屏幕大小设定table高度 */
		this.userTableHeight = window.innerHeight - 353;
        this.getHistoryList();
        this.getUserGroup();
    },
    methods: {
        setCmdTypes(){
            getCmdType().then( v => {
                let tData = [];
                for(let i in v.data){
                    let pData = {};
                    pData.label = i;
                    pData.value = v.data[i];
                    tData.push(pData);
                }
                this.typeOptions = tData;
            })
        },
        handleCurrentChange(page){
            this.currentPage = page;
            this.getHistoryList();
		},
		handleSizeChange(pageSize){
            this.currentPage = 1;
            this.tablePageSize = pageSize;
            this.getHistoryList();
        },
        /* 获取所有用户列表 */
        getHistoryList(){
            let params = {
                keyword: this.search,
                page: this.currentPage,
                page_size: this.tablePageSize
            }
            if(this.dateValue && this.dateValue.length > 0){
				params.start_time_format = this.dateValue[0];
				params.end_time_format = this.dateValue[1];
			}
            this.loading = true;
            this.tableData = [];
            rebateHistoryInfo(params).then( data => {
                this.loading = false;
                let statistic = data.data.statistic;
                if(data.code == 0){
                    this.tableData = data.data.row;
                    this.total = data.data.total*1;
                    this.countData[0].value = statistic.count;
                    this.countData[1].value = statistic.profit_all;
                    this.countData[2].value = statistic.account_count;
                    this.countData[3].value = statistic.login_count;
                    this.countData[4].value = statistic.volume_all;
                }else{
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }
            })
        },
        toFindList(){
            this.getHistoryList();
        },
        changeDate(v){
            //this.getHistoryList();
            if(this.dateValue == this.lastDate){
                return;
            }else{
                this.lastDate = this.dateValue;
                this.getHistoryList();
            }
        },
        /* 打开添加 dialog */
        toAddDialog(){
            this.addVisible = true;
            if(this.$refs.addRebateForm){
                this.$refs.addRebateForm.resetFields();
            }
        },
        /* 关闭添加 dialog */
        handleClose(){
            this.$refs.addRebateForm.resetFields();
            this.addVisible = false;
        },
        /* 提交佣金信息 */
        submitRebate(){
            this.$refs.addRebateForm.validate( (valid) => {
                if(valid){
                    let params = {
                        ticket: this.addRebateForm.ticket,
                        account: this.addRebateForm.account,
                        login: this.addRebateForm.login,
                        symbol: this.addRebateForm.symbol,
                        group: this.addRebateForm.group,
                        cmd: this.addRebateForm.cmd,
                        volume: this.addRebateForm.volume,
                        open_time: this.addRebateForm.open_time,
                        close_time: this.addRebateForm.close_time,
                        profit: this.addRebateForm.profit
                    }
                    this.submitLoading = true;
                    insertRebate(params).then( v => {
                        this.submitLoading = false;
                        if(v.code == 0){
                            this.$message({
                                type: 'success',
                                message: this.$t('placeholder.addSuccess')
                            })
                            this.addVisible = false;
                            this.getHistoryList();
                        }else{
                            this.$message({
                                type: 'error',
                                message: v.msg
                            })
                        }
                    })
                }
            })
        },
        /* 获取select数据 */
        getUserGroup(){
            getUsdGroup().then( data => {
                let tData = [];
                data.data.map( (v,i) => {
                    let pData = {};
                    pData.label = v.GROUP;
                    pData.value = i;
                    tData.push(pData);
                })
                this.groupOptions = tData;
            })
        },
        /* 开仓时间验证 */
        validateOpentime(rule, value, callback){      
            let openTimeStamp = getTimestamp(this.addRebateForm.open_time);
            let closeTimeStamp = getTimestamp(this.addRebateForm.close_time);
            if(openTimeStamp > closeTimeStamp){
                callback(this.$t('other.selectRightDate'));
            }else{
                callback();
            }
        },
        /* 平仓时间验证 */
        validateClosetime(rule, value, callback){
            let openTimeStamp = getTimestamp(this.addRebateForm.open_time);
            let closeTimeStamp = getTimestamp(this.addRebateForm.close_time);
            if(openTimeStamp > closeTimeStamp){
                callback(this.$t('other.selectRightDate'));
            }else{
                callback();
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.rebateHistory{
    .header{
        height: 40px;
        line-height: 40px;
    }
    .btn{
        text-align:right;
    }
    .search{
        padding-right: 0px !important;
        text-align: right;
    }
    .historyList{
        .page{
            text-align: center;
            margin-top: 20px;
        }
    }
    .hostoryCount{
        margin-bottom:10px;
        line-height: 28px;
        height: 28px;
    }
    .historySum{
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
.rebateHistory .el-card__header{
    padding: 10px 20px;
}
.rebateHistory .el-card__header{
    padding: 10px 20px;
}
.header .el-input{
    width: 250px;
}
.historyList .el-table th{
	background: rgb(223, 240, 216);
}
.historyList .el-table td,.historyList .el-table th{
	padding: 6px 0px;
}
.el-menu-item i{
    color: #fff;
}
.addRebateDialog .el-range-editor.el-input__inner{
    width: 100%;
}
.addRebateDialog .el-date-editor.el-input,.addRebateDialog .el-date-editor.el-input__inner{
    width: 100%;
}
.addRebateDialog .el-select{
    width: 100%;
}
</style>

