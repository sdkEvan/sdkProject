<template>
    <div class="tradingHistory">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;{{$t('indexLang.tradingHistory')}}</span>
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
    </div>
</template>
<script>
import { getHistoryList } from "@/api/report/report"
import { GMTToDate , strToGMT , getNowDate , getFirstDate } from "@/utils/utils"
export default {
    name:'tradingHistory',
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
				{ propName: 'TICKET',labelName: this.$t('table.ticket'),width: '100' },
				{ propName: 'LOGIN',labelName: this.$t('table.account'),width: '80' },
				{ propName: 'NAME',labelName: this.$t('table.name'),width: '100' },
				{ propName: 'OPEN_TIME',labelName: this.$t('table.positionOpentime'),width: '150' },
				{ propName: 'CMD',labelName: this.$t('table.type'),width: '100' },
				{ propName: 'SYMBOL',labelName: this.$t('table.symbol'),width: '100' },
				{ propName: 'VOLUME',labelName: this.$t('indexLang.volume'),width: '100' },
				{ propName: 'OPEN_PRICE',labelName: this.$t('table.openprice'),width: '100' },
				{ propName: 'SL',labelName: this.$t('table.stoploss'),width: '100' },
                { propName: 'TP',labelName: this.$t('table.topprofit'),width: '100' },
                { propName: 'CLOSE_TIME',labelName: this.$t('table.closeTime'),width: '150' },
                { propName: 'ORDER_ID',labelName: this.$t('table.orderId'),width: '100' },
				{ propName: 'COMMISSION',labelName: this.$t('table.commiss'),width: '100' },
				{ propName: 'SWAPS',labelName: this.$t('table.swaps'),width: '100' },
				{ propName: 'PROFIT',labelName: this.$t('table.profit'),width: '100' }
            ],
            userTableHeight: 0
        }
    },
    created() {
        /* 初始化时间范围 */
        this.dateValue = [getFirstDate(),getNowDate()];
    },
    mounted(){
        /* 根据不同屏幕大小设定table高度 */
		this.userTableHeight = window.innerHeight - 315;
        this.getHistoryList();
    },
    methods: {
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
            getHistoryList(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    this.tableData = data.data.row;
                    this.total = data.data.total*1;
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
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.tradingHistory{
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

}
</style>
<style>
.tradingHistory .el-card__header{
    padding: 10px 20px;
}
.tradingHistory .el-card__header{
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
</style>

