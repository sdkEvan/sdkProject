<template>
    <div class="clientReport">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;交易账号报表</span>
                        </el-col>
                        <el-col :span="18" class="search">
                            <el-input placeholder="请输入关键词" v-model="search" style="display: inline-block;">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-date-picker 
                                v-model="dateValue"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions" style="display: inline-block;">
                            </el-date-picker>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div v-loading="loading">
                <clientList :rootData="tableData" @current-page="tablePageChange" @page-size="handleSizeChange" :pTableTotal="total" v-if="status" :pCurrentPage="current_page" :pPageSize="page_size"></clientList>
            </div>
        </el-card>
    </div>
</template>
<script>
import clientList from "@/components/report/clientList";
//import { getClientList } from "@/api/report/report"
export default {
    name:'clientReport',
      data() {
        return {
            search: '',
            tableData: [],
            status: false,
            loading: false,
            total: 0,
            current_page: 1,
            page_size: 10,
            dateValue: '',
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
        }
    },
    created() {
        this.getClientList();   
    },
    mounted(){
        
    },
    components: {
        clientList
    },
    methods: {
        tablePageChange(page,pageSize){
            this.status = false;
            this.current_page = page;
            this.page_size = pageSize;
            this.getClientList();
		},
		handleSizeChange(page,pageSize){
            this.status = false;
            this.current_page = page;
            this.page_size = pageSize;
            this.getClientList();
        },
        /* 获取所有用户列表 */
        getClientList(){
            let params = {
                page: this.current_page,
                page_size: this.page_size
            }
            /* this.loading = true;
            getClientList(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    this.tableData = data.data.row;
                    this.total = data.data.total*1;
                    this.status = true;
                }
            }) */
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.clientReport{
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

}
</style>
<style>
.clientReport .el-card__header{
    padding: 10px 20px;
}
.clientReport .el-card__header{
    padding: 10px 20px;
}
.header .el-input{
    width: 250px;
}
.el-menu-item i{
    color: #fff;
}
</style>

