<template>
    <div class="personalReport" v-loading.body="loading">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;{{$t('indexLang.personalReport')}}</span>
                        </el-col>
                        <el-col :span="18" class="search">
                            <el-input :placeholder="$t('placeholder.enterKeyword')" v-model="search" @keyup.native.enter="toFindList" style="display: inline-block;">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-date-picker 
                                v-model="reportDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                @change="changeDate"
                                value-format="yyyy-MM-dd"
                                :range-separator="$t('button.to')" :start-placeholder="$t('button.startDate')" :end-placeholder="$t('button.endDate')" style="display: inline-block;">
                            </el-date-picker>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div style="height: calc(100vh - 260px)">
                <client-list :rootData="tableData" @current-page="tablePageChange" @page-size="handleSizeChange" :pTableTotal="total" v-if="status" :pCurrentPage="current_page" :pPageSize="page_size" :pReportDate="reportDate"></client-list>
            </div>
        </el-card>
    </div>
</template>
<script>
import clientList from "@/components/report/clientList";
import { getPersonalInfo } from "@/api/report/report";
import {  getNowDate , getFirstDate , money } from "@/utils/utils"
export default {
    name:'personalReport',
      data() {
        return {
            search: '',
            tableData: [],
            status: false,
            loading: false,
            total: 0,
            current_page: 1,
            page_size: 10,
            reportDate: null,
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
            loading: false
        }
    },
    created(){
        /* 初始化时间范围 */
        this.reportDate = [getFirstDate(),getNowDate()];
    },
    mounted(){
        this.getUserList();
    },
    components: {
        clientList
    },
    methods: {
        tablePageChange(page,pageSize){
            this.status = false;
            this.current_page = page;
            this.page_size = pageSize;
            this.getUserList();
		},
		handleSizeChange(page,pageSize){
            this.status = false;
            this.current_page = page;
            this.page_size = pageSize;
            this.getUserList();
        },
        /* 获取所有用户列表 */
        getUserList(){
            let params = {
                keyword: this.search,
                page: this.current_page,
                page_size: this.page_size
            }
            if(this.reportDate && this.reportDate.length > 0){
				params.start_time_format = this.reportDate[0];
				params.end_time_format = this.reportDate[1];
            }
            this.loading = true;
            this.tableData = [];
            getPersonalInfo(params).then( data => {
                this.loading = false;
                let tData = data.data.row;
                if(data.code == 0){
                    tData.map( v => {
                        v.IN_DEPOSIT = v.IN_DEPOSIT;
                        v.OUT_DEPOSIT = v.OUT_DEPOSIT;
                        v.NET_DEPOSIT = v.NET_DEPOSIT;
                        v.BALANCE = v.BALANCE;
                        v.COMMISSION = v.COMMISSION;
                    })
                    this.tableData = tData;
                    this.total = data.data.total*1;
                    this.status = true;
                }else{
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }
            })
        },
        toFindList(){
            this.getUserList();
        },
        changeDate(v){
            //this.getUserList();
            if(this.reportDate == this.lastDate){
                return;
            }else{
                this.lastDate = this.reportDate;
                this.getUserList();
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.personalReport{
    .header{
        height: 40px;
        line-height: 40px;
    }
    .search{
        padding-right: 0px !important;
        text-align: right;
    }

}
</style>
<style>
.personalReport .el-card__header{
    padding: 10px 20px;
}
.header .el-input{
    width: 250px;
}
.el-menu-item i{
    color: #fff;
}
</style>

