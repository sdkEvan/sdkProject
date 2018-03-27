<template>
    <div class="allUser" v-loading="loading">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="6">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;1{{$t('indexLang.userlist')}}</span>
                        </el-col>
                        <el-col :span="13" class="btn">
                            <el-button type="primary" @click="addUser" :loading="addUserLoading" v-if="showAddBtn">
                                {{$t('button.add')}}&nbsp;<i class="fa fa-user-plus" aria-hidden="true"></i>
                            </el-button>
                            <!-- <el-button type="danger" v-if="showDelBtn">
                                {{$t('button.del')}}&nbsp;<i class="fa fa-user-times" aria-hidden="true"></i>
                            </el-button> -->
                        </el-col>
                        <el-col :span="5" class="search">
                            <el-input ref="keyword" :placeholder="$t('placeholder.enterKeyword')" v-model="search" @keyup.native.enter="toFindList">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div style="height: calc(100vh - 260px)">
                <user-list :rootData="tableData" @current-page="tablePageChange" @page-size="handleSizeChange" @getUserList="getUserList" :pTableTotal="total" v-if="status" :pCurrentPage="current_page" :pPageSize="page_size"></user-list>
            </div>
        </el-card>
        <!-- 添加用户 dialog -->
        <div class="addDialog">
            <el-dialog :title="$t('dialog.addUser')" ref="addDialog" :visible.sync="addVisible" width="70%" :before-close="addClose">
                <el-row :gutter="20" class="add-form">
                    <el-form ref="addForm" :model="addForm" label-width="200px" :rules="addRules">
                        <el-col :span="11" class="addLeftform">
                            <el-form-item :label="$t('dialog.username')" prop="username">
                                <el-input v-model="addForm.username" :placeholder="$t('placeholder.enterUsername')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.password')" prop="password">
                                <el-input v-model="addForm.password" :placeholder="$t('placeholder.enterPass')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.confirmPass')" prop="verifyPass">
                                <el-input v-model="addForm.verifyPass" :placeholder="$t('placeholder.enterPassAgain')"></el-input>
                            </el-form-item>
                            <el-form-item label="Email" prop="email">
                                <el-input v-model="addForm.email" :placeholder="$t('placeholder.enterEmail')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.userGroup')" prop="userGroup">
                                <el-select v-model="addForm.userGroup" clearable :placeholder="$t('placeholder.selectGroup')" @change="changeGroup">
                                    <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.Superior')" prop="superior">
                                <!-- <el-select v-model="addForm.superior" clearable :placeholder="$t('placeholder.selectSuperior')" @change="changeSuperior">
                                    <el-option v-for="item in superiorOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select> -->
                                <el-input v-model="addForm.superior" :placeholder="$t('placeholder.selectSuperior')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13" class="addRightform">
                            <el-form-item :label="$t('table.enName')" prop="enName">
                                <el-input v-model="addForm.enName" :placeholder="$t('placeholder.enterName')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('table.cnName')" prop="cnName">
                                <el-input v-model="addForm.cnName" :placeholder="$t('placeholder.enterName')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.mobile')" prop="phone">
                                <el-input v-model="addForm.phone" :placeholder="$t('placeholder.enterPhone')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.checkGroup')" prop="groupRadio">
                                <el-radio v-model="addForm.groupRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="addForm.groupRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.checkMobile')" prop="contactRadio">
                                <el-radio v-model="addForm.contactRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="addForm.contactRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                            <el-form-item :label="$t('dialog.lock')" prop="loginRadio">
                                <el-radio v-model="addForm.loginRadio" label="1" border>{{$t('button.yes')}}</el-radio>
                                <el-radio v-model="addForm.loginRadio" label="0" border>{{$t('button.no')}}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addClose">{{$t('button.cancle')}}</el-button>
                    <el-button type="primary" @click="addUserSubmit">{{$t('button.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import userList from "@/components/user/userList";
import { getAllUser,addUser } from "@/api/user/user"
import { isWscnEmail } from '@/utils/validate';
import { inArray , getSession } from "@/utils/utils"
export default {
    name:'allUser',
      data() {
        return {
            search: '',
            tableData: [],
            status: false,
            loading: false,
            total: 0,
            current_page: 1,
            page_size: 20,
            addVisible: false,
            addForm: {
                username: '',
                password: '',
                verifyPass: '',
                email: '',
                enName: '',
                cnName: '',
                phone: '',
                userGroup: '',
                groupRadio: '1',
                contactRadio: '0',
                loginRadio: '1',
                superior: ''
            },
            addRules: {
                username: [
		            { validator: this.validateUsername, required: true, trigger: 'blur' },
	          	],
	          	password: [
	            	{ validator: this.validatePass, required: true, trigger: 'blur' }
	          	],
	          	verifyPass: [
	            	{ validator: this.validatePassAgain, required: true, trigger: 'blur' }
                ],
                email: [
		            { validator: this.validateEmail, required: true, trigger: 'blur' },
                ],
                userGroup: [
                    { required: true, message: this.$t('placeholder.selectGroup'), trigger: 'change' }
                ],
                superior: [
                    { required: true, message: this.$t('placeholder.selectSuperior'), trigger: 'blur' }
                ],
                enName: [
		            { required: true, message: this.$t('placeholder.enterName'), trigger: 'blur' },
                ],
                cnName: [
		            { required: true, message: this.$t('placeholder.enterName'), trigger: 'blur' },
                ],
                phone: [
		            { validator: this.validatePhone, required: true, trigger: 'blur' },
                ],
                groupRadio: [
		            { required: true,  trigger: 'change' },
                ],
                contactRadio: [
		            { required: true,  trigger: 'change' },
                ],
                loginRadio: [
		            { required: true,  trigger: 'change' },
                ]  
            },
            groupOptions: [
                {label: this.$t('dialog.systemAdmin'),value: '11'},
                {label: this.$t('dialog.introducedBroker'),value: '12'}
            ],
            /* superiorOptions: [
                {label: '系统管理员',value: '系统管理员'},
                {label: '介绍经纪商',value: '介绍经纪商'}
            ], */
            addUserLoading: false
        }
    },
    created() {
        this.getUserList();   
    },
    computed: {
        /* 是否显示 添加按钮 */
        showAddBtn(){
            return inArray('add',getSession('authList'))
        },
        /* 是否显示 删除按钮 */
        showDelBtn(){
            return inArray('delete',getSession('authList'))
        }
    },
    mounted(){
        
    },
    components: {
        userList
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
            this.loading = true;
            getAllUser(params).then( data => {
                this.loading = false;
                if(data.code == 0){
                    let tData = data.data.row;
                    tData.map( v => {
                        if(this.$i18n.locale == 'en'){
                            v.ROLE = v.ROLE_EN;
                        }
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
        /* 添加用户 */
        addUser(){
            this.addVisible = true;
        },
        /* 关闭添加dialog */
        addClose(){
            this.addVisible = false;
            this.$refs.addForm.resetFields();
        },
        /* 选择用户组 */
        changeGroup(){
            
        },
        changeSuperior(){
            
        },
        /* 用户名验证 */
        validateUsername(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterUsername')));
	        }else{
	        	var ptn = /^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.usernameIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 密码验证 */
    	validatePass(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterPass')));
	        }else{
	        	var ptn = /^[A-Za-z0-9]{5,15}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.passIllegality')));
	        	}else{
	        		if(this.addForm.verifyPass !== ''){
		            	this.$refs.addForm.validateField('verifyPass');
		          	}
		          	callback();
	        	}	
	        }
        },
        /* 再次验证密码 */
    	validatePassAgain(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterPassAgain')));
	        }else if(value !== this.addForm.password) {
	          	callback(new Error(this.$t('placeholder.passagainError')));
	        } else {
	          	callback();
	        }
        },
        /* 邮箱验证 */
        validateEmail(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterEmail')));
	        }else{
                var res = isWscnEmail(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.emailIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 姓名验证 */
        validateName(rule, value, callback){
    		if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterName')));
	        }else{
	        	var ptn = /^[A-Za-z0-9\u4e00-\u9fa5]{2,15}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.nameIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 手机验证 */
        validatePhone(rule, value, callback){
            if(value === ''){
	          	callback(new Error(this.$t('placeholder.enterPhone')));
	        }else{
	        	var ptn = /^1[34578]\d{9}$/;
	        	var res = ptn.test(value);
	        	if(!res){
	        		callback(new Error(this.$t('placeholder.iphoneIllegality')));
	        	}else{
	        		callback();
	        	}
	        }
        },
        /* 添加用户 提交 */
        addUserSubmit(){
            this.$refs.addForm.validate( (valid) => {
                if(valid){
                    let params = {
                        username: this.addForm.username,
                        password: this.addForm.password,
                        repassword: this.addForm.verifyPass,
                        email: this.addForm.email,
                        mobile: this.addForm.phone,
                        role: this.addForm.userGroup,
                        real_name: this.addForm.enName,
                        real_name_cn: this.addForm.cnName,
                        is_show_group: Number(this.addForm.groupRadio),
                        is_show_contact: Number(this.addForm.contactRadio),
                        enable: Number(this.addForm.loginRadio),
                        superior: this.addForm.superior
                    }
                    this.addUserLoading = true;
                    addUser(params).then( data => {
                        this.addUserLoading = false;
                        if(data.code == 0){
                            this.$message({
                                message: this.$t('placeholder.adduserSuccess'),
                                type: 'success'
                            });
                            this.addVisible = false;
                            this.getUserList();
                        }else{
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.allUser{
    .header{
        height: 40px;
        line-height: 40px;
    }
    .btn{
        text-align:right;
        height: 100%;
    }
    .search{
        padding-right: 0px !important;
    }

}
</style>
<style>
.allUser .el-card__header{
    padding: 10px 20px;
}
.el-menu-item i{
    color: #fff;
}
.add-form .el-form-item__label{
    padding: 0 20px 0 0 ;
}
.addLeftform .el-form-item__label{
    width: 155px !important;
}
.addLeftform .el-form-item__content{
    margin-left: 155px !important;
}
.addLeftform .el-select{
    width: 100%;
}
.addDialog .el-dialog__body{
    padding-right: 50px;
}
</style>

