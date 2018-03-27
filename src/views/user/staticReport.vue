<template>
    <div class="staticReport">
        <upload-excel @on-selected-file="getExcelData"></upload-excel>
        <!-- <el-button type="danger" class="staticFloat" @click="toExportExcelAlone" :loading="aloneLoading">单独导出excel</el-button> -->
        <el-button type="primary" @click="toExportExcel" class="staticFloat" :loading="loading">{{$t('other.exportExcel')}}</el-button>
        <el-date-picker 
            class="staticFloat"
            v-model="dateValue" 
            type="daterange"
            :range-separator="$t('button.to')"
            :start-placeholder="$t('button.startDate')"
            :end-placeholder="$t('button.endDate')"
            value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-select v-model="tableType" clearable :placeholder="$t('other.selectExportType')" style="float: right;">
            <el-option v-for="item in tableOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <!-- <el-button type="danger" @click="toTest">测试，别点</el-button> -->
        <el-table :data="tableData" style="width:100%;margin-top: 20px;" border>
            <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'></el-table-column>
        </el-table>
    </div>
</template>
<script>
import uploadExcel from '@/components/common/uploadExcel'
import { export_json_to_excel } from "@/vendor/Export2Excel";
import { parseTime } from "@/utils/exportExcel";
import { exportRebateInfo , exportHistoryInfo , exportAloneInfo , exportWithdrawInfo , exportTransferInfo , exportUserBalance } from '@/api/export/export'
export default {
    name: "staticReport",
    data() {
        return {
            //targetExcelData: [],
            tableData: [],
            tableHeader: [],
            loginData: [],
            dateValue: null,
            tableOptions: [
                {label: 'rebate_report',value: '0'},
                {label: 'rebate_history',value: '1'},
                {label: 'withdraw_history',value: '2'},
                {label: 'transfer_history',value: '3'},
                {label: 'user_balance',value: '4'}
            ],
            tableType: null,
            loading: false,
            aloneLoading: false
        };
    },
    mounted() {},
    components: {
        uploadExcel
    },
    methods: {
        toTest(){
            const setObj = new Set();
            let tData = [2, 3, 5, 4, 5, 2, 2];
            //tData.forEach( x => setObj.add(x));
            /* tData.forEach( v => {
                setObj.add(v)
            })
            for (let i of setObj) {
                
            } */
            var data = [1, 2, 3, 4];
            let pData = data.map( v => {
                return v*v;
            })
        },
        /* 导出excel */
        toExportExcel() {
            if(this.tableType == null){
                this.$message({
                    type: 'error',
                    message: this.$t('other.selectExportType')
                })
                return;
            }
            if(this.dateValue == null){
                this.$message({
                    type: 'error',
                    message: this.$t('other.selectDate')
                })
                return;
            }
            require.ensure([], () => {
                switch(this.tableType){
                    case '0':
                        this.exportRebateReport();
                        break;
                    case '1':
                        this.exportRebateHistory();
                        break;
                    case '2':
                        this.exportWithdrawHistory();
                        break;
                    case '3':
                        this.exportTransferHistory();
                        break;
                    case '4':
                        this.exportUserBalanceHistory();
                        break;
                        
                }
            });
        },
        /* 单独导出excel */
        toExportExcelAlone(){
            this.aloneLoading = true;
            exportAloneInfo().then( data => {
                this.aloneLoading = false;
                if(data.code == 0){
                    let tData = data.data;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'report-alone');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            })
        },
        /* 导出佣金报表 */
        exportRebateReport(){
            let params = {
                login_arr: this.loginData,
                start_time_format: this.dateValue[0],
                end_time_format: this.dateValue[1]
            }
            this.loading = true;
            exportRebateInfo(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'rebate-report');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            });
        },
        /* 导出佣金历史报表 */
        exportRebateHistory(){
            let params = {
                login_arr: this.loginData,
                start_time_format: this.dateValue[0],
                end_time_format: this.dateValue[1]
            }
            this.loading = true;
            exportHistoryInfo(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'rebate-history');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            });
        },
        /* 导出出金历史报表 */
        exportWithdrawHistory(){
            let params = {
                login_arr: this.loginData,
                start_time_format: this.dateValue[0],
                end_time_format: this.dateValue[1]
            }
            this.loading = true;
            exportWithdrawInfo(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'withdraw-history');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            });
        },
        /* 导出转账申请报表 */
        exportTransferHistory(){
            let params = {
                login_arr: this.loginData,
                start_time_format: this.dateValue[0],
                end_time_format: this.dateValue[1]
            }
            this.loading = true;
            exportTransferInfo(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'transfer-history');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            });
        },
        /* 导出用户余额报表 */
        exportUserBalanceHistory(){
            let params = {
                login_arr: this.loginData,
                start_time_format: this.dateValue[0],
                end_time_format: this.dateValue[1]
            }
            this.loading = true;
            exportUserBalance(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    if(tData.length > 0){
                        let tDataKeys = Object.keys(tData[0]);
                        this.exportExcelMethod(tData,tDataKeys,tDataKeys,'user-balance');
                    }else{
                        this.$message({
                            type: 'warning',
                            message: this.$t('home.noData')
                        })
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    })
                }
            });
        },
        /* 导出excel 方法 */
        exportExcelMethod(targetExcelData,tHeader,filterVal,tableName){
            let pData = this.formatJson(filterVal,targetExcelData);
            export_json_to_excel(tHeader, pData, tableName);
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    return v[j];
                })
            );
        },
        getExcelData(data) {
            this.tableData = data.results;
            this.tableHeader = data.header;
            let tData = [];
            data.results.map( v => {
                tData.push(v.Login);
            })
            //tData = ["100004","100009"];
            this.loginData = tData;
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.staticReport {
    /* text-align: center; */
    .staticFloat{
        float: right;
        margin-left: 5px;
    }
}
</style>
<style>
.staticReport .el-input{
    width: 200px;
}
</style>

