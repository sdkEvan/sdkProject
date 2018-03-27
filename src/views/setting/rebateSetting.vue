<template>
    <div class="rebate">
        <el-card class="box-card">
            <div slot="header">
                <el-select v-model="select" filterable allow-create :placeholder="$t('placeholder.changeGroup')" @change="getGroupData" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
                </el-select>
            </div>
            <el-row :gutter="15" v-loading="showLoading">
                <el-col :span="24">
                    <el-col :span="4" class="rebateText">
                        <div class="rebateTitle"></div>
                    </el-col>
                    <el-col :span="4" class="rebateText">
                        <div class="rebateTitle">Rebate</div>
                    </el-col>
                    <el-col :span="3" class="rebateText">
                        <div class="rebateTitle">MIB Rebate</div>
                    </el-col>
                    <el-col :span="3" class="rebateText">
                        <div class="rebateTitle">SIB Rebate</div>
                    </el-col>
                    <el-col :span="4" class="rebateText">
                        <div class="rebateTitle">Pips</div>
                    </el-col>
                    <el-col :span="3" class="rebateText">
                        <div class="rebateTitle">MIB Pips</div>
                    </el-col>
                    <el-col :span="3" class="rebateText">
                        <div class="rebateTitle">SIB Pips</div>
                    </el-col>
                </el-col>
                <el-col :span="24" v-for="(item,index) in infoData" :key="index">
                    <el-col :span="4" class="rebateText">
                        <el-tag>{{item.SYMBOL}}</el-tag>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="item.COMMISSION_ALL" placeholder="Rebate"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="item.COMMISSION_MIB" placeholder="MIB Rebate"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="item.COMMISSION_SIB" placeholder="SIB Rebate"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="item.PIPS_ALL" placeholder="Pips"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="item.PIPS_MIB" placeholder="MIB Pips"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="item.PIPS_SIB" placeholder="SIB Pips"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="24" class="rebateBtn">
                    <el-button type="primary" @click="preview">Preview</el-button>
                    <!-- <el-button type="success">Examine</el-button> -->
                </el-col>
                <div class="rebateDialog">
                    <el-dialog title="Preview" :visible.sync="dialogVisible" width="80%" :before-close="rebateDialogClose">
                    <el-table :data="tableData" style="width: 100%" border> 
                        <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item">
                            <template slot-scope="scope">
                                {{scope.row[index]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="operation" prop="status">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" v-show="scope.row.status == '1'" @click="submitInfo(scope.row)">submit</el-button>
                                <el-button type="success" size="small" v-show="scope.row.status == '2'">submitted</el-button>
                                <el-button type="warning" size="small" v-show="scope.row.status == '3'" @click="submitInfo(scope.row)">modify</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-dialog>
                </div>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { getUsdGroup,getGroupData,updateSetting} from "../../api/setting/rebateSetting"
export default {
    name:'rebateSetting',
      data() {
        return {
            select: '',
            options: [
                {label: 'COMM_CN_USD',value: 1},
                {label: 'FX_6_CN_000_USD',value: 2},
                {label: 'FX_6_CN_VIP_USD',value: 3},
                {label: 'FX_5_CN_10L_USD',value: 4},
                {label: 'FX_5_CN_622_USD',value: 5},
                {label: 'FX_6_CN_103_USD',value: 6}
            ],
            infoData: [],
            rebateData: [
                {SYMBOL: 'XAUUSD',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'XAGUSD',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'OIL',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'CHINA50',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'INDIA50',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'DOLLARINDEX',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'CASHINDEXES',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
                {SYMBOL: 'FX',COMMISSION_ALL: '',COMMISSION_MIB: '',COMMISSION_SIB: '',PIPS_ALL: '',PIPS_MIB: '',PIPS_SIB: '',status: '1'},
            ],
            dialogVisible: false,
            tableData: [],
            tableHead: {'SYMBOL': 'tag','COMMISSION_ALL': 'Rebate','COMMISSION_MIB': 'MIB Rebate','COMMISSION_SIB': 'SIB Rebate','PIPS_ALL':'Pips','PIPS_MIB':'MIB Pips','PIPS_SIB': 'SIB Pips'},
            showLoading: false
        }
    },
    created() {
        this.infoData = this.rebateData;
    },
    mounted(){
        this.getUsdGroup();
    },
    methods: {
        /* 预览 */
        preview(){
            if(this.select == ''){
                this.$message({
                    message: this.$t('placeholder.changeGroup'),
                    type: 'error'
                });
                return;
            }
            this.dialogVisible = true;
            this.tableData = this.infoData;
        },
        change(index) {
            /* this.infoData.find(v=>{return v.com===true}).input=Number(this.infoData[1].input)+Number(this.infoData[2].input) */
            
        },
        /* 关闭dialog */
        rebateDialogClose(){
            this.dialogVisible = false;

        },
        submitInfo(row){
            let params = {
                group: this.select,
                info: row
            }
            updateSetting(params).then( data => {
                if(data.code == 0){
                    if(row.status == 1){
                        this.$message({
                            message: this.$t('placeholder.addSuccess'),
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: this.$t('placeholder.editSuccess'),
                            type: 'success'
                        });
                    }
                    row.status = '2';
                }else{
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 根据group筛选相应数据 */
        getGroupData(){
            let params = {
                group: this.select
            }
            this.showLoading = true;
            getGroupData(params).then( data => {
                this.showLoading = false;
                let tData = data.data;
                this.rebateData = this.clearData(this.rebateData);
                if(tData.length > 0){
                    tData.forEach(v=>{
                        this.rebateData.find( (val,i)=>{
                            if(val.SYMBOL === v.SYMBOL){
                                this.rebateData[i] = v
                                this.rebateData[i].status = 3;
                            }
                        })
                    })
                    this.infoData = [...this.rebateData];
                }else{
                    this.infoData = this.clearData(this.rebateData);
                }
                
                
                
            })
        },
        /* 获取select数据 */
        getUsdGroup(){
            getUsdGroup().then( data => {
                let tData = [];
                data.data.map( (v,i) => {
                    let pData = {};
                    pData.label = v.GROUP;
                    pData.value = i;
                    tData.push(pData);
                })
                this.options = tData;
            })
        },
        /* 清空数据 */
        clearData(data){
            data.map( v => {
                v.COMMISSION_ALL = v.COMMISSION_MIB = v.COMMISSION_SIB = v.PIPS_ALL = v.PIPS_MIB = v.PIPS_SIB = '';
                v.status = 1;
            })
            return data;
        }
    }
}
</script>

<style>
/* .rebate .el-card__header{
    padding: 10px 20px;
} */
.rebate .el-card__body{
    padding: 35px 20px;
}
.rebateText{
    margin-bottom: 10px;
}
.rebateText .el-tag{
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
}
.rebateBtn{
    margin-top: 20px;
    text-align:center;
}
.rebateDialog .el-dialog__body{
    padding:10px 20px 20px 20px;
}
.rebateDialog .el-table .cell{
    text-align: center;
}
.rebateDialog .el-table td{
    padding: 8px 0;
}
.rebateTitle{
    text-align: left;
    padding-left: 15px;
    color: #409EFF;
}
.rebateDialog .el-button+.el-button{
    margin-left: 0px;
}
.rebateDialog .el-button{
    width: 100%;
}
.el-message{
    min-width: 300px;
}
</style>

