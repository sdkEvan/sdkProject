<template>
    <div class="index">
        <!-- 数值统计 START -->
        <div class="index-count">
            <el-row :gutter="20">
                <el-col :span="24" v-loading="loading" v-if="showStatistics">
                    <el-col :span="6" style="padding-left: 0px;">
                        <div class="index-rect" style="padding-right:20px;background: pink;">
                            <div class="number">{{countInfo.newAccount}}</div>
                            <div class="desc">{{$t('indexLang.newAccount')}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="index-rect" style="padding-right:20px;background: #66b1ff;">
                            <div class="number">{{countInfo.deposit}}</div>
                            <div class="desc">{{$t('indexLang.dailyDeposit')}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="index-rect" style="padding-right:20px;background: #edc23f;">
                            <div class="cnumber">{{countInfo.withdraw}}</div>
                            <div class="cdesc">{{$t('indexLang.dailyWithdraw')}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6" style="padding-right: 0px;">
                        <div class="index-rect" style="background: #1deaaa">
                            <div class="number">{{countInfo.bargainCount}}</div>
                            <div class="desc">{{$t('indexLang.dailyVolume')}}</div>
                        </div>
                    </el-col>
                </el-col>
            </el-row>
        </div>
        <!-- 数值统计 END -->
        <!-- 图标统计 START -->
        <div class="index-echart">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="8" class="leftCol" v-if="showMonthRegister">
                        <card :showTitle="true" :headHeight="28" bgcolor="#337ab7" headColor="#fff">
                            <span slot="title">
                                <i class="fa fa-line-chart" aria-hidden="true"></i>
                                <span>&nbsp;{{$t('indexLang.monthReg')}}</span>
                            </span>
                            <div slot="content" class="content">
                                <div ref="clientChart" class="clientChart" v-loading="clientLoading"></div>
                            </div>
                        </card>
                    </el-col>
                    <el-col :span="8" v-if="showVolumeStatistics">
                        <card :showTitle="true" :headHeight="28" bgcolor="#fcf8e3" headColor="#8a6d3b">
                            <span slot="title">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span>&nbsp;{{$t('indexLang.volumeSta')}}</span>
                            </span>
                            <div slot="content" class="content">
                                <div ref="dealChart" class="dealChart" v-loading="dealLoading"></div>
                            </div>
                        </card>
                    </el-col>
                    <el-col :span="8" class="rightCol" v-if="showactiveStatistic">
                        <card :showTitle="true" :headHeight="28" bgcolor="#dff0d8" headColor="#3c763d">
                            <span slot="title">
                                <i class="fa fa-pie-chart" aria-hidden="true"></i>
                                <span>&nbsp;{{$t('indexLang.customersActivity')}}</span>
                            </span>
                            <div slot="content" class="content">
                                <div ref="pieChart" class="pieChart" v-loading="pieLoading"></div>
                            </div>
                        </card>
                    </el-col>
                </el-col>
            </el-row>
        </div>
        <!-- 图标统计 END -->
    </div>
</template>
<script>
import echarts from "echarts"
import card from "../../components/common/card"
import { getClientStatistic,getVolumeStatistic,getActiveStatistic,getIndexStatistic } from "@/api/user/user"
import { arrMax , inArray , getSession } from "@/utils/utils"
export default {
    name:'index',
    data() {
        return {
            countInfo: {
                newAccount: 0,
                deposit: 0,
                withdraw: 0,
                bargainCount: 0
            },
            clientLoading: false,
            dealLoading: false,
            pieLoading: false,
            loading: false,
            
        }
    },
    computed: {
        clientChart(){
            if(this.$refs.clientChart){
                return echarts.init(this.$refs.clientChart);
            }
        },
        dealChart(){
            if(this.$refs.dealChart){
                return echarts.init(this.$refs.dealChart);
            }
        },
        pieChart(){
            if(this.$refs.pieChart){
                return echarts.init(this.$refs.pieChart);
            } 
        },
        /* 是否显示统计 4块 */
        showStatistics(){
            return inArray('statistic',getSession('authList'))
        },
        /* 是否显示 Monthly Register */
        showMonthRegister(){
            return inArray('register_statistic',getSession('authList'))
        },
        /* 是否显示 Volume Statistics */
        showVolumeStatistics(){
            return inArray('volume_statistic',getSession('authList'))
        },
        /* 是否显示 Customers Activity */
        showactiveStatistic(){
            return inArray('active_statistic',getSession('authList'))
        }
    },
    mounted(){
        this.getIndexCount();
        this.setClientChart();
        this.setDealChart();
        this.setPieChart();
    },
    components: {
        card
    },
    methods: {
        /* 首页统计数据 */
        getIndexCount(){
            this.loading = true;
            getIndexStatistic().then ( v => {
                this.loading = false;
                if(v.code == 0){
                    this.countInfo.newAccount = v.data.COUNT;
                    this.countInfo.deposit = v.data.DEPOSIT;
                    this.countInfo.withdraw = v.data.WITHDRAW;
                    this.countInfo.bargainCount = v.data.VOLUME;
                }
            })
        },
        /* 客户数月增长 */
        clientOption(v,maxNum){
            return {
                title: {
                    text: '',
                    show: false
                },
                tooltip: {
                    formatter: function (params) {
                        let tData = this.$t('indexLang.monthReg') + '：' + params.data;
                        return tData;
                    }.bind(this)
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    top: '12%',
                    containLabel: true
                },
                color: ['#eec23f','#afd9f8'/* ,'#cb4b4b' */],
                legend: {
                    itemWidth: 15,
                    itemHeight: 15,
                    right: '8%',
                    data: [
                        {
                            name: this.$t('indexLang.tradeAccount'),
                            icon: 'rect',
                        },{
                            name: this.$t('indexLang.ibReport'),
                            icon: 'rect',
                        }
                    ]
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        fontSize: 12
                    },
                    splitNumber: 6,
                    //boundaryGap: ['1%', '1%'],
                    //data: ['2017-07','2017-08','2017-09','2017-10','2017-11','2017-12']
                    data: v.time_line
                },
                yAxis: {
                    min: 0,
                    max: maxNum,
                    type: 'value',
                    axisLine: {onZero: false}
                },
                series: [
                    {
                        name: this.$t('indexLang.tradeAccount'),
                        type: 'line',
                        symbolSize: 8,
                        showAllSymbol: true,
                        lineStyle: {
                            normal: {
                                color: '#eec23f',
                                width: 3
                            }
                        },
                        //data: [120, 132, 101, 134, 90, 230, 210]
                        data: v.trading_accounts
                    },
                    {
                        name: this.$t('indexLang.ibReport'),
                        type: 'line',
                        symbolSize: 8,
                        showAllSymbol: true,
                        lineStyle: {
                            normal: {
                                color: '#afd9f8',
                                width: 3
                            }
                        },
                        //data: [150, 232, 201, 154, 190, 300]
                        data: v.brokers
                    }
                ]
            }
        },
        setClientChart(){
            this.clientLoading = true;
            getClientStatistic().then( v => {
                this.clientLoading = false;
                if(v.code == 0){
                    let tradingMax = arrMax(v.data.trading_accounts);
                    let brokersMax = arrMax(v.data.brokers);
                    let maxNum = tradingMax > brokersMax ? tradingMax : brokersMax;
                    if(this.clientChart){
                        this.clientChart.setOption(this.clientOption(v.data,maxNum));
                    }
                }
            })
        },
        /* 交易数量统计 */
        dealOption(v,maxNum){
            return {
                title: {
                    text: '',
                    show: false
                },
                tooltip: {
                    formatter: function (params) {
                        return this.$t('indexLang.monthVolume') +'：'+ params.data;
                    }.bind(this)
                },
                grid: {
                    left: '3%',
                    right: '10%',
                    bottom: '3%',
                    top: '12%',
                    containLabel: true
                },
                color: ['#eec23f'],
                legend: {
                    itemWidth: 15,
                    itemHeight: 15,
                    right: '8%',
                    data: [
                        {
                            name: this.$t('indexLang.volume'),
                            icon: 'rect',
                        }
                    ]
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    //data: ['2017-10','2017-11','2017-12']
                    data: v.time_line
                },
                yAxis: {
                    min: 0,
                    max: maxNum,
                    type: 'value',
                    axisLine: {onZero: false}
                },
                series: [
                    {
                        name: this.$t('indexLang.volume'),
                        type: 'line',
                        symbolSize: 8,
                        lineStyle: {
                            normal: {
                                color: '#eec23f',
                                width: 3
                            }
                        },
                        //data: [30000, 32000, 4000]
                        data: v.volume
                    }
                ]
            }
        },
        setDealChart(){
            this.dealLoading = true;
            getVolumeStatistic().then( v => {
                this.dealLoading = false;
                if(v.code == 0){
                    let maxNum = arrMax(v.data.volume);
                    if(this.dealChart){
                        this.dealChart.setOption(this.dealOption(v.data,maxNum));
                    }
                }
            })
        },
        /* 本月客户活跃度 */
        pieOption(v){
            return {
                title : {
                    show: false
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} "+this.$t('indexLang.pc')+"<br/>"+ this.$t('indexLang.scale') +"：{d}%"
                },
                color: ['#afd8f9','#cb4b4b','#edc23f'],
                series : [
                    {
                        name: this.$t('indexLang.customersActivity'),
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        /* data:[
                            {value:335, name:'入金账户'},
                            {value:310, name:'活跃账户'},
                            {value:234, name:'不活跃账户'}
                        ], */
                        data: v,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: "{b}",
                            }
                        }
                    }
                ]
            }
        },
        setPieChart(){
            this.pieLoading = true;
            getActiveStatistic().then( v => {
                this.pieLoading = false;
                if(v.code == 0){
                    v.data.map( data => {
                        if(this.$i18n.locale == 'en'){
                            data.name = data.name_en;
                        }
                    })
                    if(this.pieChart){
                        this.pieChart.setOption(this.pieOption(v.data));
                    }
                }
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.index{
    .index-count{
        text-align: center;
        margin-top: 20px;
        .number{
            font-size: 30px;
            color: black;
            font-weight: bold;
        }
        .desc{
            margin-top: 10px;
            font-size: 14px;
            color: black;
        }
        .cnumber{
            font-size: 30px;
            color: black;
            font-weight: bold;
        }
        .cdesc{
            font-size: 14px;
            color: black;
            margin-top: 10px;
        }
        .index-rect{
            height:110px;
            padding-top: 40px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }
    }
    .index-echart{
        margin-top: 20px;
        .leftCol{
            padding-left: 0px !important;
        }
        .rightCol{
            padding-right: 0px !important;
        }
        .content{
            height: 350px;
            .clientChart{
                height: calc(100% - 30px);
                width: calc(100% - 30px);
                padding: 15px;
            }
            .dealChart{
                height: calc(100% - 30px);
                padding: 15px;
            }
            .pieChart{
                height: calc(100% - 30px);
                padding: 15px;
            }
        }
    }
}

</style>
<style>
.index-count .el-card__body{
    padding: 0px;
}
</style>

