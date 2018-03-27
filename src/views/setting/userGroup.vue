<template>
    <div class="userGroup" v-loading.body="userLoading">
        <el-card class="box-card">
            <div slot="header">
                <el-row :gutter="15">
                    <el-col :span="24" class="header">
                        <el-col :span="18">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span>&nbsp;{{$t('table.groupMana')}}</span>
                        </el-col>
                        <el-col :span="6" class="btn">
                            <el-button type="primary" @click="addUser" v-if="showAddBtn">{{$t('button.add')}}&nbsp;<i class="fa fa-user-plus" aria-hidden="true"></i></el-button>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div>
                <usergroupList :tableData="tableData" :tableHead="tableHead" :tableTotal="total" @current-change="tableCurrentChange" @reload-list="reloadGroupList" :currentPage="currentPage" :tablePageSize="pageSize" @pagesize-change="tablePagesizeChange"></usergroupList>
            </div>
        </el-card>
        <!-- 添加用户 dialog -->
        <div class="addgroupDialog">
            <el-dialog :title="$t('dialog.addUserGroup')" :visible.sync="addDialog" width="40%" :before-close="addClose">
                <el-form ref="addForm" :model="addForm" :label-width="$i18n.locale == 'en' ? '180px' : '100px'" :rules="addRules">
                    <el-form-item :label="$t('dialog.groupName')" prop="groupName">
                        <el-input v-model="addForm.groupName" :placeholder="$t('placeholder.enterUserGroupCnName')"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="enGroupName">
                        <el-input v-model="addForm.enGroupName" :placeholder="$t('placeholder.enterUserGroupEnName')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dialog.groupDesc')" prop="groupDesc">
                        <el-input type="textarea" v-model="addForm.groupDesc" :autosize="{minRows: 3,maxRows: 3}" resize="none" :placeholder="$t('placeholder.enterUserGroupCnDesc')"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="enGroupDesc">
                        <el-input type="textarea" v-model="addForm.enGroupDesc" :autosize="{minRows: 3,maxRows: 3}" resize="none" :placeholder="$t('placeholder.enterUserGroupEnDesc')"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addClose">{{$t('button.cancle')}}</el-button>
                    <el-button type="primary" @click="addGroupSubmit" :loading="addLoading">{{$t('button.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import usergroupList from "@/components/setting/usergroupList"
import { getUserGroup,addUserGroup } from "@/api/setting/groupSetting"
import { inArray , getSession } from "@/utils/utils"
export default {
    name:'userGroup',
      data() {
        return {
            tableData: [],
            tableHead: [
                { propName: 'role_id',labelName: '#',width: '50' },
				{ propName: this.$i18n.locale == 'en' ? 'role_name_en' : 'role_name',labelName: this.$t('table.groupName'),width: '120' },
                { propName: this.$i18n.locale == 'en' ? 'description_en' : 'description',labelName: this.$t('table.userAuth'),width: '120' }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            addDialog: false,
            addForm: {
                groupName: '',
                enGroupName: '',
                groupDesc:'',
                enGroupDesc: ''
            },
            addRules: {
                groupName: [
                    { required: true, message: this.$t('placeholder.enterUserGroupCnName'), trigger: 'blur' }
                ],
                enGroupName: [
                    { required: true, message: this.$t('placeholder.enterUserGroupEnName'), trigger: 'blur' }
                ],
                groupDesc: [
                    { required: true, message: this.$t('placeholder.enterUserGroupCnDesc'), trigger: 'blur' }
                ],
                enGroupDesc: [
                    { required: true, message: this.$t('placeholder.enterUserGroupEnDesc'), trigger: 'blur' }
                ]
            },
            addLoading: false,
            userLoading: false
        }
    },
    computed: {
        /* 是否 显示添加用户组按钮 */
        showAddBtn(){
            return inArray('add_group',getSession('authList'));
        }
    },
    mounted(){
        this.reloadGroupList();
    },
    components: {
        usergroupList
    },
    methods: {
        addClose(){
            this.addDialog = false;
            this.$refs.addForm.resetFields();
        },
        addUser(){
            this.addDialog = true;
        },
        /* 添加用户组提交 */
        addGroupSubmit(){
            this.$refs.addForm.validate( (valid) => {
                if(valid){
                    let params = {
                        role_name: this.addForm.groupName,
                        role_name_en: this.addForm.enGroupName,
                        description: this.addForm.groupDesc,
                        description_en: this.addForm.enGroupDesc,
                        status: 1
                    }
                    this.addLoading = true;
                    addUserGroup(params).then( v => {
                        this.addLoading = false;
                        if(v.code == 0){
                            this.$message({
                                message: this.$t('placeholder.adduserGroupSuccess'),
                                type: 'success'
                            });
                            this.addDialog = false;
                            this.reloadGroupList();
                        }else{
                            this.$message({
                                message: this.$t('placeholder.adduserGroupError'),
                                type: 'error'
                            });
                        }
                    })
                }
            })
        },
        reloadGroupList(){
            let params = {
                page: this.currentPage,
                page_size: this.pageSize
            }
            this.userLoading = true;
            getUserGroup(params).then( v => {
                let tData = v.data.row;
                tData.map( data => {
                    data.btnLoading = false;
                })
                this.userLoading = false;
                if(v.code == 0){
                    this.tableData = v.data.row;
                    this.total = v.data.total*1;
                }else{
                    this.$message({
                        message: v.msg,
                        type: 'error'
                    });
                }
            })
        },
        /* 点击分页 */
        tableCurrentChange(v){
            this.currentPage = v;
            this.reloadGroupList();
        },
        /* pagesize 改变 */
        tablePagesizeChange(v){
            this.pageSize = v;
            this.reloadGroupList();
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.userGroup{
    .header{
        height: 40px;
        line-height: 40px;
    }
    .btn{
        padding-left: 15px;
        text-align: right;
    }

}
</style>
<style>
.userGroup .el-card__header{
    padding: 10px 20px;
}
.el-menu-item i{
    color: #fff;
}
.el-textarea__inner{
    font-family: Arial;
}
</style>

