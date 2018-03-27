<template>
    <div class="introduceBroker" v-loading="loading">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;{{$t('indexLang.introBroker')}}</span>
                        </el-col>
                        <el-col :span="18" class="search">
                            <el-input :placeholder="$t('placeholder.enterKeyword')" v-model="search" @keyup.native.enter="toFindList" style="display: inline-block;">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-date-picker 
                                v-model="accountDate"
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
                <account-list :rootData="tableData" @current-page="tablePageChange" @page-size="handleSizeChange" :pTableTotal="total" v-if="status" :pCurrentPage="current_page" :pPageSize="page_size"></account-list>
            </div>
        </el-card>
    </div>
</template>
<script>
import accountList from "@/components/account/accountList";
import { getBrokerList } from "@/api/account/account";
export default {
    name:'introduceBroker',
      data() {
        return {
            search: '',
            tableData: [],
            status: false,
            loading: false,
            total: 0,
            current_page: 1,
            page_size: 20,
            accountDate: null,
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
        this.getUserList();
    },
    mounted(){
        
    },
    components: {
        accountList
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
            if(this.accountDate && this.accountDate.length > 0){
				params.start_time_format = this.accountDate[0];
				params.end_time_format = this.accountDate[1];
			}
            this.loading = true;
            this.tableData = [];
            getBrokerList(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    this.tableData = data.data.row;
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
            if(this.accountDate == this.lastDate){
                return;
            }else{
                this.lastDate = this.accountDate;
                this.getUserList();
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.introduceBroker{
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
.introduceBroker .el-card__header{
    padding: 10px 20px;
}
.header .el-input{
    width: 250px;
}
.el-menu-item i{
    color: #fff;
}
</style>

