<template>
    <div class="home">
        <div class="header" :class="{mouseDisabled: mouseStatus}">
            <el-row :gutter="15">
                <!-- logo START -->
                <el-col :span="3" style="font-size: 0"><img src="../assets/img/svs_logo.jpg" style="height: 60px;"></el-col>
                <!-- logo END -->
                <!-- 导航栏 START -->
                <el-col :span="14" class="head-menu">
                    <el-menu
                        :default-active="activeIndex"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="handleSelect"
                        background-color="black"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        >
                        <!-- <li v-for="(item,index) in navData" :key="index" v-if="item.status"> -->
                        <li v-for="(item,index) in navData" :key="index" v-if="item.status">
                            <el-submenu :index="item.index" v-if="item.children">
                                <template slot="title">
                                    <span :class="item.class" aria-hidden="true"></span>
                                    <span style="vertical-align: middle;">{{item.label}}</span>
                                </template>
                                <el-menu-item v-for="(val,j) in item.children" :key="j" :index="val.index" @click="jump(val.index,val.path)" v-if="val.status">
                                    {{val.label}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item :index="item.index" v-else @click="jump(item.index,item.path)">
                                <template slot="title">
                                    <i :class="item.class" aria-hidden="true"></i>
                                    <span style="vertical-align: middle;">{{item.label}}</span>
                                </template>
                            </el-menu-item>
                        </li>
                    </el-menu>
                </el-col>
                <!-- 导航栏 END -->
                <!-- 操作 START -->
                <el-col :span="7" class="head-operation">
                    <span style="color:red;vertical-align:middle;" class="el-icon-my-meijin"></span>
                    <span class="balance-style" :class="{smallSize: isSmall}">{{user_balance}}</span>
                    <span @click="changeLanguage" style="margin-left: 10px;">
                        <el-tag type="danger"><span v-if="isEnglish">EN</span><span v-else>CN</span></el-tag>
                    </span>
                    <!-- <el-select v-model="operation" placeholder="请选择操作">
                        <el-option v-for="item in operationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select> -->
                    <el-dropdown style="margin-left:10px;">
                        <span class="el-dropdown-link">
                            <img width="30" style="vertical-align: middle;" src="../assets/img/user.png" />
                            &nbsp;{{login_username}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" class="set-icon">
                            <el-dropdown-item v-if="showSystemMsg">
                                <div @click="viewMessage">
                                    <i class="fa fa-bell" aria-hidden="true"></i><span class="drop-margin">{{$t('home.systemMsg')}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="toLink">
                                    <i class="fa fa-random" aria-hidden="true"></i><span class="drop-margin">{{$t('home.link')}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="toMoney" v-if="showWithdraw">
                                    <div style="width: 14px;display:inline-block"><span class="el-icon-my-chujinn"></span></div><span class="drop-margin">{{$t('home.withDraw')}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="toTransfer">
                                    <div style="width: 14px;display:inline-block"><span class="el-icon-my-zhuanzhang"></span></div><span class="drop-margin">{{$t('home.transferApply')}}</span>
                                </div>
                            </el-dropdown-item>
                            <!-- <el-dropdown-item>
                                <div @click="toCheck" v-if="showCheckMsg">
                                    <div style="width: 14px;display:inline-block"><span class="el-icon-my-sh"></span></div><span class="drop-margin">{{$t('home.withDrawCheck')}}</span>
                                </div>
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                                <div @click="editPassword" v-if="showEditMsg" class="edPwd">
                                    <span class="el-icon-my-addmsg"></span><span class="drop-margin">{{$t('home.editPwd')}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                                <div class="home-logout" @click="loginOut">
                                    <i class="fa fa-power-off" aria-hidden="true"></i><span class="drop-margin">{{$t('home.logout')}}</span>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <!-- 操作 END -->
            </el-row>
        </div>
        <div class="routerView">
            <transition name="slide-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <div class="footer">
            <p>{{footerInfo}}</p>
            <p>Email：<a href="mailto:cn.support@svsfx.com">cn.support@svsfx.com</a> | Tel: 400-606-2000 |
                Address: London | <a href="http://www.svsfx.com" target="_blank">www.svsfx.com</a></p>
        </div>
        <!-- 修改密码 dialog -->
        <el-dialog :title="$t('home.editPwd')" :visible.sync="pwdVisible" width="30%" :before-close="pwdClose">
            <div class="pwdDialog">
                <el-form :model="pwdForm" :rules="pwdRules" ref="pwdForm" :label-width="$i18n.locale == 'en' ? '150px' : '80px'">
                    <el-form-item :label="$t('home.oldPwd')" prop="oldPwd">
                        <el-input v-model="pwdForm.oldPwd"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dialog.password')" prop="newPwd">
                        <el-input v-model="pwdForm.newPwd"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dialog.confirmPass')" prop="checkNewPwd">
                        <el-input v-model="pwdForm.checkNewPwd"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pwdClose">{{$t('button.cancle')}}</el-button>
                <el-button type="primary" @click="editPwdSubmit">{{$t('button.confirm')}}</el-button>
            </span>
        </el-dialog>
        <!-- 推广链接 dialog -->
        <el-dialog :title="$t('home.link')" :visible.sync="linkVisible" width="40%" :before-close="linkClose" custom-class="linkDialog">
            <div class="link-card" v-loading="linkLoading">
                <el-card class="box-card" v-for="(item,index) in linkData" :key="index" style="margin-bottom: 10px;width: 100%;">
                    <div class="linkTitle">{{index}}</div>
                    <div class="linkDesc"><a :href="item" target="_blank">{{item}}</a></div>    
                </el-card>
            </div>
        </el-dialog>
        <!-- 系统公告 -->
        <el-dialog :title="$t('home.systemMsg')" :visible.sync="messageVisible" width="80%" :before-close="messageClose" custom-class="messageDialog">
            <div class="messageContent" v-if="messageData.length == 0" v-loading="msgLoading">
                <div class="msgSend" v-if="showAddMsg">
                    <el-button type="primary" @click="addMsg">{{$t('home.addMsg')}}&nbsp;<span class="el-icon-my-addmsg"></span></el-button>
                </div>
                <div class="messageDesc" :class="{showMsgBtn: !showAddMsg}" ref="messageDesc">
                    {{$t('home.noData')}}
                </div>
            </div>
            <div class="messageContent" v-else v-loading="msgLoading">
                <div class="msgSend" v-if="showAddMsg">
                    <el-button type="primary" @click="addMsg">{{$t('home.addMsg')}}&nbsp;<span class="el-icon-my-addmsg"></span></el-button>
                </div>
                <div class="messageDesc" :class="{showMsgBtn: !showAddMsg}" ref="messageDesc">
                    <el-card class="msgCard" v-for="(item,index) in messageData" :key="index">
                        <!-- <span class="msgIsread" :class="{isRead: item.read_status}">
                            <span class="el-icon-my-look"></span>
                        </span> -->
                        <span class="msgDel" @click="delMsg(item.message_id)" v-if="showDelMsg">
                            <span class="el-icon-my-delete"></span>
                        </span>
                        <div class="linkTitle">{{item.title}}</div>
                        <div class="linkDesc" :class="{contentColor: item.read_status == '0' ? false : true}" @click="isReadNow(item)">{{item.content}}</div>    
                    </el-card>
                </div>
            </div>
            <div class="messagePage">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10,15,20,30 ,50,100,200]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <el-dialog :title="$t('home.addMsg')" :visible.sync="addMsgVisible" width="40%" :before-close="addMsgClose" append-to-body>
                <el-form :model="addMsgForm" :rules="addMsgRules" ref="addMsgForm" label-width="80px">
                    <el-form-item :label="$t('home.title')" prop="title">
                        <el-input v-model="addMsgForm.title" :placeholder="$t('placeholder.enterMsgTitle')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('home.content')" prop="content">
                        <el-input type="textarea" v-model="addMsgForm.content" :autosize="{minRows: 5,maxRows: 5}" resize="none" :placeholder="$t('placeholder.enterMsgContent')"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addMsgClose">{{$t('button.cancle')}}</el-button>
                    <el-button type="primary" @click="addMsgSubmit" :loading="addMsgLoading">{{$t('button.confirm')}}</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
import { inArray , getSession } from "@/utils/utils"
import { updatePassword , referLinkData , systemMessageData , deleteMessage , markMessage , sendMessage } from "@/api/login/login"
import { getNewBalance } from "@/api/user/user"
import locale from 'element-ui/lib/locale'
export default {
    name: 'home',
    data() {
        return {
            activeIndex: '',
            operation: '',
            navData: [
                {
                    label: this.$t('indexLang.index'),
                    index: '1',
                    path: 'index',
                    class: 'fa fa-bank',
                    status: inArray('manage_index',getSession('authList'))
                },
                {
                    label: this.$t('indexLang.User'),
                    index: '2',
                    class: 'fa fa-users',
                    status: inArray('user_index',getSession('authList')),
                    children: [
                        {
                            label: this.$t('indexLang.userlist'),
                            index: '2-1',
                            path: 'allUser',
                            status: inArray('user_index',getSession('authList'))
                        },
                        {
                            label: this.$t('home.rebateHistory'),
                            index: '2-2',
                            path: 'rebateHistory',
                            status: inArray('rebate_history',getSession('authList'))
                        },
                        {
                            label: this.$t('home.withDrawCheck'),
                            index: '2-3',
                            path: 'withdrawCheck',
                            status: inArray('withdraw_check',getSession('authList'))
                        },
                        {
                            label: this.$t('home.transferCheck'),
                            index: '2-4',
                            path: 'transferCheck',
                            status: inArray('rebate_history',getSession('authList'))
                        },
                        {
                            label: this.$t('home.staticReport'),
                            index: '2-5',
                            path: 'staticReport',
                            status: inArray('withdraw_check',getSession('authList'))
                        },
                        {
                            label: this.$t('other.bankcardCheck'),
                            index: '2-6',
                            path: 'bankcardCheck',
                            status: inArray('withdraw_check',getSession('authList'))
                        }
                    ]
                },
                {
                    label: this.$t('indexLang.Account'),
                    index: '3',
                    class: 'fa fa-user',
                    status: inArray('account_index',getSession('authList')),
                    children: [
                        {
                            label: this.$t('indexLang.allAccount'),
                            index: '3-1',
                            path: 'allAccount',
                            status: inArray('account_index',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.introBroker'),
                            index: '3-2',
                            path: 'introduceBroker',
                            status: inArray('my_brokers',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.retailAccount'),
                            index: '3-3',
                            path: 'retailAccount',
                            status: inArray('my_retails',getSession('authList'))
                        }
                    ]
                },
                {
                    label: this.$t('indexLang.Report'),
                    index: '4',
                    class: 'fa fa-th',
                    status: inArray('self_report',getSession('authList')),
                    children: [
                        {
                            label: this.$t('indexLang.personalReport'),
                            index: '4-1',
                            path: 'personalReport',
                            status: inArray('self_report',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.ibReport'),
                            index: '4-2',
                            path: 'IBReport',
                            status: inArray('broker_report',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.retailAccount'),
                            index: '4-3',
                            path: 'retailClient',
                            status: inArray('retail_report',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.positionReport'),
                            index: '4-4',
                            path: 'positionReport',
                            status: inArray('trade_report',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.tradingHistory'),
                            index: '4-5',
                            path: 'tradingHistory',
                            status: inArray('trade_history_report',getSession('authList'))
                        }
                    ]
                },
                {
                    label: this.$t('indexLang.Setting'),
                    index: '5',
                    class: 'fa fa-wrench',
                    status: inArray('settings_index',getSession('authList')),
                    children: [
                        {
                            label: this.$t('indexLang.discountSet'),
                            index: '5-1',
                            path: 'rebateSetting',
                            status: inArray('rebate_settings',getSession('authList'))
                        },
                        {
                            label: this.$t('indexLang.groupSet'),
                            index: '5-2',
                            path: 'userGroup',
                            status: inArray('user_group',getSession('authList'))
                        }
                        /* {
                            label: this.$t('indexLang.operationLog'),
                            index: '5-4',
                            path: 'operationLog',
                            status: true
                        } */
                    ]
                },
            ],
            footerInfo: '',
            isEnglish: sessionStorage.getItem('language') == 'cn' ? true : false,
            mouseStatus: false,
            pwdVisible: false,
            pwdForm: {
                oldPwd: '',
                newPwd: '',
                checkNewPwd: ''
            },
            pwdRules: {
                oldPwd: [
                    { required: true, message: this.$t('placeholder.enterPass'), trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: this.$t('placeholder.enterNewPass'), trigger: 'blur' }
                ],
                checkNewPwd: [
                    { required: true, message: this.$t('placeholder.enterPassAgain'), trigger: 'blur' }
                ]
            },
            linkVisible: false,
            linkData: [],
            messageVisible: false,
            messageData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            msgLoading: false,
            addMsgVisible: false,
            addMsgForm: {
                title: '',
                content: ''
            },
            addMsgRules: {
                title: [
                    { required: true, message: this.$t('placeholder.enterMsgTitle'), trigger: 'blur' }
                ],
                content: [
                    { required: true, message: this.$t('placeholder.enterMsgContent'), trigger: 'blur' }
                ]
            },
            addMsgLoading: false,
            linkLoading: false,
            isSmall: false,
            user_balance: 0
        }
    },
    computed: {
        /* 记录登录用户名 */
        login_username(){
            let userSession = JSON.parse(sessionStorage.getItem('user_info'));
            return userSession.NAME;
        },
        /* 记录登录用户的余额 */
        login_balance(){
            let userSession = JSON.parse(sessionStorage.getItem('user_info'));
            return userSession.BALANCE;
        },
        /* 记录鼠标状态 */
        /* mouseStatus(){
            return sessionStorage.getItem('disabledCode');
        }, */
        /* 是否显示 系统公告 */
        showSystemMsg(){
            return inArray('message_index',getSession('authList'))
        },
        /* 是否可发布消息 */
        showAddMsg(){
            return inArray('send_message',getSession('authList'))
        },
        /* 是否可删除消息 */
        showDelMsg(){
            return inArray('delete_message',getSession('authList'))
        },
        /* 是否可修改密码 */
        showEditMsg(){
            return inArray('change_pwd',getSession('authList'))
        },
        /* 出金申请 */
        showWithdraw(){
            return inArray('withdraw',getSession('authList'))
        },
        /* 出金审核 确认 */
        showCheckMsg(){
            return inArray('withdraw_check',getSession('authList'))
        },
        thisYear(){
            let date = new Date();
            return date.getFullYear();
        }
    },
    created(){
        this.getUserBalance();
    },
    mounted(){
        this.user_balance = this.login_balance;
        this.activeIndex = this.$route.meta.index;
        this.mouseStatus = true;
        if(this.login_balance.length > 10){
            this.isSmall = true;
        }
        this.footerInfo = this.$t('indexLang.fotter1') + this.thisYear + this.$t('indexLang.fotter2');
        /* this.$refs.indexRef.tabIndex = 1;
        this.$refs.userRef.tabIndex = 1;
        this.$refs.accRef.tabIndex = 1;
        this.$refs.mentRef.tabIndex = 1;
        this.$refs.windowRef.tabIndex = 1; */
    },
    watch: {
        $route(newVal,oldVal){
            this.activeIndex = newVal.meta.index;
        },
        mouseStatus(v){
            
        }
    },
    methods: {
        /* 获取用户余额 */
        getUserBalance(){
            getNewBalance().then( v => {
                if(v.code == 0){
                    let userSession = JSON.parse(sessionStorage.getItem('user_info'));
                    userSession.BALANCE = v.data.BALANCE;
                    this.user_balance = v.data.BALANCE;
                    sessionStorage.setItem('user_info',JSON.stringify(userSession));
                }else{
                    this.$message({
                        type: 'error',
                        message: v.msg
                    })
                }
            })
        },
        handleSelect(v){
            
        },
        /* 路由跳转 */
        jump(index,path){
            this.activeIndex = index;
            this.$router.push('/'+ path);
        },
        /* 切换语言 */
        changeLanguage(){
            this.isEnglish = !this.isEnglish;
            if(this.isEnglish){
                this.$i18n.locale = 'cn';
                sessionStorage.setItem('language','cn');
                window.location.reload();
            }else{
                this.$i18n.locale = 'en';
                sessionStorage.setItem('language','en');
                window.location.reload();
            }
        },
        /* 修改密码 */
        editPassword(){
            this.pwdVisible = true;
        },
        /* 退出登录 */
        loginOut(){
            this.$router.push({name:'登录'});
        },
        pwdClose(){
            this.pwdVisible = false;
            this.$refs.pwdForm.resetFields();
        },
        /* 修改密码提交 */
        editPwdSubmit(){
            let params = {
                username: JSON.parse(sessionStorage.getItem('user_info')).LOGIN,
                password1: this.pwdForm.oldPwd,
                password2: this.pwdForm.newPwd,
                password3: this.pwdForm.checkNewPwd
            }
            updatePassword(params).then( v=> {
                if(v.code == 0){
                    this.$message({
                        message: this.$t('home.loginAgain'),
                        type: 'success'
                    });
                    this.pwdVisible = false;
                    this.$router.push({name:'登录'});
                }else if(code == '100006'){
                    this.$message({
                        message: this.$t('home.oldPwdError'),
                        type: 'error'
                    });
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 推广链接 */
        toLink(){
            this.linkVisible = true;
            this.linkLoading = true;
            referLinkData().then( v => {
                this.linkLoading = false;
                if(v.code == 0){
                    this.linkData = v.data;
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 出金申请 */
        toMoney(){
            this.$router.push('/withdraw')
        },
        /* 转账申请 */
        toTransfer(){
            this.$router.push('/transfer')
        },
        /* 出金审核 */
        toCheck(){
            this.$router.push('/withdrawCheck')
        },
        linkClose(){
            this.linkVisible = false;
        },
        messageClose(){
            this.messageVisible = false;
        },
        /* 系统公告 */
        viewMessage(){
            this.messageVisible = true;
            this.currentPage = 1;
            this.pageSize = 10;
            this.reloadMessage();
        },
        reloadMessage(){
            let params = {
                page: this.currentPage,
                page_size: this.pageSize
            }
            this.msgLoading = true;
            systemMessageData(params).then( v => {
                this.msgLoading = false;
                if(v.code == 0){
                    this.messageData = v.data.row;
                    this.total = v.data.total*1;
                    this.$refs.messageDesc.scrollTop = 0;
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        handleSizeChange(v){
            this.pageSize = v;
            this.reloadMessage();

        },
        handleCurrentChange(v){
            this.currentPage = v;
            this.reloadMessage();
        },
        /* 删除消息 */
        delMsg(msgId){
            this.$confirm(this.$t('home.confirmDel'), this.$t('home.hint'), {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancle'),
                type: 'warning'
            }).then(() => {
                let params = {
                    message_id: msgId,
                }
                deleteMessage(params).then( v => {
                    if(v.code == 0){
                        this.$message({
                            type: 'success',
                            message: this.$t('home.deleted')
                        });
                        this.reloadMessage();
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
                    message: this.$t('home.cancleDel')
                });          
            });
        },
        /* 发布消息 */
        addMsg(){
            this.addMsgVisible = true;
        },
        /* 关闭发布消息 dialog */
        addMsgClose(){
            this.addMsgVisible = false;
            this.$refs.addMsgForm.resetFields();
        },
        /* 发布消息 提交 */
        addMsgSubmit(){
            this.$refs.addMsgForm.validate( (valid) => {
                if(valid){
                    let params = {
                        title: this.addMsgForm.title,
                        content: this.addMsgForm.content
                    }
                    this.addMsgLoading = true;
                    sendMessage(params).then( v => {
                        this.addMsgLoading = false;
                        if(v.code == 0){
                            this.$message({
                                message: this.$t('home.msgSuccess'),
                                type: 'success'
                            });
                            this.addMsgVisible = false;
                            this.$refs.addMsgForm.resetFields();
                            this.currentPage = 1;
                            this.pageSize = 10;
                            this.reloadMessage();
                        }else{
                            this.$message({
                                message: v.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            })
        },
        isReadNow(v){
            if(v.read_status == '0'){
                let params = {
                    message_id: v.message_id
                }
                markMessage(params).then( data => {
                    if(data.code == '0'){
                        v.read_status = 1;
                    }else{
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                })
            }
            
        }
    }
}
</script>

<style scoped>
.home{
    height: 100%;
}
.header{
    height: 60px;
    background: black;
    min-width: 1120px;
}
.routerView {
    width: calc(100% - 40px);
    height: calc(100% - 157px);
    /* padding: 20px 20px 50px 20px; */
    padding: 20px;
    overflow: auto;
}
.footer{
    padding: 10px 0px;
    position: fixed;
    height: 40px;
    width: 100%;
    left: 0;
    bottom: 0;
    font-size: 12px;
    color: #b8b8b8;
    text-align: center;
    background: #232a34;
    z-index: 3;
}
.footer a{
    text-decoration:none;
    color:#b8b8b8;
}
.el-dropdown-link{
    color: #fff;
    cursor: pointer;
}
.linkTitle{
    font-weight: bold;
    font-size: 16px;
    word-wrap:break-word;
}
.linkDesc{
    word-wrap: break-word;
}
.messageContent{
    height: 452px;
}
.messageDesc{
    /* border: 1px solid red; */
    height: calc(100% - 62px);
    overflow-x: auto;
    padding-right: 5px;
}
.showMsgBtn{
    height: 100%;
}
.messagePage{
    margin-top: 15px;
    text-align: center;
}
.msgCard{
    margin-bottom: 10px;
    width: 100%;
    position: relative;
    cursor: pointer;
}
.msgDel{
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
}
.msgIsread{
    position: absolute;
    top: 7px;
    right: 34px;
    cursor: pointer;
}
.isRead{
    color: red;
}
.msgSend{
    padding: 5px 15px 15px 0px;
    text-align: right;
}
.msgDel:hover,.msgIsread:hover{
    color: #409eff;
}
.link-card{
    height: 250px;
}
.contentColor{
    color: #bbb;
}
.balance-style{
    color:#fff;
    vertical-align:middle;
    font-size: 16px;
}
.smallSize{
    font-size: 12px !important;
}
.drop-margin{
    margin-left: 10px;
}
</style>
<style>
.header .el-row{
    margin-right: 0px !important;
}
.head-menu .el-menu--horizontal{
    border: none;
}
/* .head-menu .el-menu--horizontal .el-submenu .el-submenu__title{
    height: 75px;
    line-height: 75px;
} */
.head-menu .el-menu--horizontal .el-menu-item:hover{
    background: rgb(84, 92, 100) !important;
}
.head-menu .el-menu--horizontal .el-submenu .el-submenu__title:hover{
    background: rgb(84, 92, 100) !important;
}
.head-menu .el-menu--horizontal .el-submenu .el-submenu__icon-arrow{
    margin-top: 0px;
}
.head-operation{
    margin-top: 15px;
    text-align: right;
    padding-right: 20px !important;
}
.head-operation .el-tag--danger{
    background: red;
    color: #fff;
    cursor: pointer;
    width: 40px;
}
.head-operation .el-input__inner{
    height: 32px;
}
.head-menu .el-menu--horizontal .el-submenu>.el-menu{
    top: 60px;
    padding: 5px 0;
}
.head-menu .el-submenu .el-menu-item{
    min-width: 100px;
}
/* .el-submenu__title i{
    color: rgb(255, 208, 75);
} */
.el-table{
    font-size: 12px !important;
}
.el-table th{
    background: rgb(223, 240, 216);
}
.el-table td,.el-table th{
    padding: 5px 0px !important;
}
/* .tableHeight .el-table td,.tableHeight .el-table th{
	padding: 5px 0px;
}
.tabHeight .el-table td,.tabHeight .el-table th{
	padding: 5px 0px;
} */
.historyDialog .el-dialog__body{
	padding: 0px 20px 10px 20px;
}
.historyDialog .el-dialog__header{
	padding: 20px 20px 0px 20px ;
}
.userDialog .el-dialog__body{
	padding-top: 10px;
	padding-bottom: 20px;
}
.userDialog .el-dialog__header{
	padding-bottom: 15px;
	border-bottom: 1px solid #e5e5e5;
}
.mouseDisabled{
    /* pointer-events: none;
    cursor: not-allowed; 
    opacity:0.5 */
}
/* 改变滚动条的样式 */
::-webkit-scrollbar{  
    width: 12px;  
    height: 12px;  
    background-color: #F5F5F5;  
} 
::-webkit-scrollbar-track{  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}  
::-webkit-scrollbar-thumb{  
    border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #ccc;  
} 
.set-icon .fa{
    vertical-align: middle;
}
.linkDialog a{
    text-decoration: none;
    color: #2d2f33;
}
.linkDialog .el-dialog__body{
    /* height: 260px; */
}
.messageDialog .el-dialog__body{
    padding-top: 0px;
}
.msgIsread .el-icon-my-look{
    font-size: 20px;
}
.el-menu-item i{
    color: #fff;
}
.loginClass{
    color: #409eff;
}
.hideIcon .el-table__expand-icon{
	display: none;
}
.el-icon-my-meijin{
    font-size: 25px;
}
.el-icon-my-sh,.el-icon-my-chujinn{
    font-size: 14px;
}
.edPwd .el-icon-my-addmsg{
    font-size: 14px;
}
.home-logout .fa-power-off{
    font-size: 18px;
}
</style>
