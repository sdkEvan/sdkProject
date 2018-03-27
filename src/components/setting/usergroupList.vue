<template>
	<div class="usergroupList" ref="usergroupList">
		<el-table :data="tableData" style="width: 100%" :height="userTableHeight" stripe border>
			<el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.labelName" :prop="item.propName" :min-width="item.width"></el-table-column>
			<el-table-column :label="$t('table.operate')" :min-width="280">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="small" @click="editUser(scope.row)" v-if="showEditBtn">{{$t('button.edit')}}</el-button>
					<el-button type="primary" icon="el-icon-view" size="small" @click="editAuth(scope.row)" v-if="showAuthBtn">{{$t('button.auth')}}</el-button>
					<span v-if="scope.row.status == 1" class="disableClass">
						<el-button type="success" size="small" icon="el-icon-success" @click="disableGroup(scope.row)" :loading="scope.row.btnLoading" v-if="showDisabledBtn">{{$t('button.disabled')}}</el-button>
					</span>
					<span v-else class="disableClass">
						<el-button type="danger" size="small" icon="el-icon-error" @click="disableGroup(scope.row)" :loading="scope.row.btnLoading" v-if="showDisabledBtn">{{$t('button.undisabled')}}</el-button>
					</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10,15,20,30 ,50,100,200]"
				:page-size="tablePageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableTotal">
			</el-pagination>
		</div>
		<!-- 修改用户组 dialog -->
        <div class="editgroupDialog">
            <el-dialog :title="$t('dialog.editGroupInfo')" :visible.sync="editDialog" width="40%" :before-close="editClose">
				<el-form ref="editForm" :model="editForm" :label-width="$i18n.locale == 'en' ? '180px' : '100px'" :rules="editRules">
					<el-form-item :label="$t('dialog.groupName')" prop="groupName">
						<el-input v-model="editForm.groupName" :placeholder="$t('placeholder.enterUserGroupCnName')"></el-input>
					</el-form-item>
					<el-form-item label="" prop="enGroupName">
						<el-input v-model="editForm.enGroupName" :placeholder="$t('placeholder.enterUserGroupEnName')"></el-input>
					</el-form-item>
					<el-form-item :label="$t('dialog.groupDesc')" prop="groupDesc">
						<el-input type="textarea" v-model="editForm.groupDesc" :autosize="{minRows: 3,maxRows: 3}" resize="none" :placeholder="$t('placeholder.enterUserGroupCnDesc')"></el-input>
					</el-form-item>
					<el-form-item label="" prop="enGroupDesc">
						<el-input type="textarea" v-model="editForm.enGroupDesc" :autosize="{minRows: 3,maxRows: 3}" resize="none" :placeholder="$t('placeholder.enterUserGroupEnDesc')"></el-input>
					</el-form-item>
				</el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editClose">{{$t('button.cancle')}}</el-button>
                    <el-button type="primary" @click="editGroupSubmit" :loading="editLoading">{{$t('button.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>
		<div class="editAuthDialog">
			<el-dialog :title="$t('dialog.editUserAuth')" :visible.sync="authDialog" width="60%" :before-close="authClose">
				<div v-loading="showAuthLoading">
					<div class="authTree">
						<el-tree :data="treeData" ref="authTree" show-checkbox node-key="menu_id" default-expand-all :default-checked-keys="selectedCode" :props="defaultProps"></el-tree>
					</div>
					<div slot="footer" class="auth-footer">
						<el-button @click="authClose">{{$t('button.cancle')}}</el-button>
						<el-button type="primary" @click="editAuthSubmit" :loading="editAuthLoading">{{$t('button.confirm')}}</el-button>
					</div>
				</div>
            </el-dialog>
		</div>
	</div>
</template>
<script>
import { updateUserGroup,getMenuList,getGroupAuth,forbidGroupAuth,editGroupAuth } from "@/api/setting/groupSetting"
import { inArray , getSession } from "@/utils/utils"
export default {
	name: "usergroupList",
	data() {
		return {
			editDialog: false,
            editForm: {
				id: '',
				groupName: '',
				enGroupName: '',
				groupDesc:'',
				enGroupDesc: ''
            },
            editRules: {
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
			authDialog: false,
			treeData: [],
			defaultProps: {
				children: 'sub_menu',
				label: this.$i18n.locale == 'en' ? 'menu_name_en' : 'menu_name'
			},
			groupTableHeight: 0,
			editLoading: false,
			disableLoading: false,
			rowId: '',
			editAuthLoading: false,
			selectedCode: [],
			showAuthLoading: true,
			userTableHeight: 0
		};
	},
	props: {
		tableData: {
			type: Array,
			default() {
				return [];
			}
		},
		tableHead: {
			type: Array,
			default() {
				return [];
			}
		},
		tableTotal: {
			type: Number,
			default() {
				return 0;
			}
		},
		currentPage: {
			type: Number,
			default() {
				return 0;
			}
		},
		tablePageSize: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	created() {
		
	},
	computed: {
		/* 是否 显示修改用户组按钮 */
        showEditBtn(){
            return inArray('update_group',getSession('authList'));
        },
        /* 是否 显示权限分配按钮 */
        showAuthBtn(){
			let user_info = sessionStorage.getItem('user_info');
			if(user_info.ROLE == '11'){
				return true;
			}
            return inArray('privilege_settings',getSession('authList'));
        },
        /* 是否 显示禁用用户组按钮 */
        showDisabledBtn(){
            return inArray('delete_group',getSession('authList'));
        }
	},
	mounted() {
		/* 根据不同屏幕大小设定table高度 */
		this.userTableHeight = window.innerHeight - 315;
	},
	methods: {
		handleSizeChange(v){
			this.$emit('pagesize-change',v);
		},
		handleCurrentChange(v){
			this.$emit('current-change',v);
		},
		/* 关闭修改 dialog */
		editClose(){
            this.editDialog = false;
		},
		editUser(row){
			this.editDialog = true;
			if(this.$refs.editForm){
				this.$refs.editForm.resetFields();
			}
			this.editForm.id = row.role_id;
			this.editForm.groupName = row.role_name;
			this.editForm.enGroupName = row.role_name_en;
			this.editForm.groupDesc = row.description;
			this.editForm.enGroupDesc = row.description_en;
		},
		/* 禁用/解禁用户组 */
		disableGroup(row){
			let params = {
				role_id: row.role_id,
			};
			if(row.status == 1){
				params.status = 3;
			}else{
				params.status = 1;
			}
			row.btnLoading = true;
			forbidGroupAuth(params).then( v => {
				row.btnLoading = false;
				if(v.code == 0){
					this.$message({
						message: this.$t('placeholder.editGroupStatusSuccess'),
						type: 'success'
					});
					this.$emit('reload-list');
				}else{
					this.$message({
                        message: v.msg,
                        type: 'error'
                    });
				}
			})
		},
		/* 获取改用户组权限 */
		editAuth(row){
			// this.$refs.authTree.$el.scrollTo(0,0);
			// $('.authTree').scrollTop(100);
			this.rowId = row.role_id;
			this.authDialog = true;
			this.showAuthLoading = true;
			$.when(getMenuList(),getGroupAuth({role_id: row.role_id})).then( (v1,v2) => {
				this.showAuthLoading = false;
				if(v1.code == 0){
					this.treeData = v1.data;
				}else{
					this.$message({
                        message: v1.msg,
                        type: 'error'
                    });
				}
				let tData = v2.data;
				let pData = [];
				if(v2.code == 0){
					tData.forEach( v => {
						pData.push(v.menu_id);
					})
					this.selectedCode = pData;
				}else{
					this.$message({
                        message: v2.msg,
                        type: 'error'
                    });
				}
				$('.authTree').scrollTop(0);
			})
		},
		authClose(){
			this.authDialog = false;
		},
		/* 修改用户组提交 */
		editGroupSubmit(){
			this.$refs.editForm.validate( (valid) => {
                if(valid){
                    let params = {
						role_id: this.editForm.id,
                        role_name: this.editForm.groupName,
                        role_name_en: this.editForm.enGroupName,
                        description: this.editForm.groupDesc,
                        description_en: this.editForm.enGroupDesc,
                        status: 1
                    }
                    this.editLoading = true;
                    updateUserGroup(params).then( v => {
                        this.editLoading = false;
                        if(v.code == 0){
                            this.$message({
                                message: this.$t('other.editUserGroupSuccess'),
                                type: 'success'
                            });
							this.editDialog = false;
							this.$emit('reload-list');
                        }else{
                            this.$message({
                                message: this.$t('other.editUserGroupFailed'),
                                type: 'error'
                            });
                        }
                    })
                }
            })
		},
		/* 修改用户组权限提交 */
		editAuthSubmit(){
			let privilegeInfo = this.$refs.authTree.getCheckedNodes();
			let params = {
				role_id: this.rowId,
				role_privilege: privilegeInfo.length > 0 ? privilegeInfo : ''
			}
			this.editAuthLoading = true;
			editGroupAuth(params).then( v => {
				this.editAuthLoading = false;
				if(v.code == 0){
					this.$message({
						message: this.$t('placeholder.editGroupAuthSuccess'),
						type: 'success'
					});
					this.authDialog = false;
				}else{
					this.$message({
						message: this.$t('placeholder.editGroupAuthError'),
						type: 'error'
					});
				}
			})
		}
	}
};
</script>
<style rel="stylesheet/scss" lang="scss">
.usergroupList{
	/* border: 1px solid red; */
	.page{
		text-align: center;
		margin-top: 20px;
	}
	.authTree{
		height: 400px;
		overflow: auto;
	}
	.disableClass{
		margin-left: 10px;
	}
	.auth-footer{
		margin-top: 30px;
		text-align: right;
	}
}
</style>
<style>
.usergroupList .el-table th{
	background: rgb(223, 240, 216);
}
.usergroupList .el-table__expanded-cell[class*=cell]{
	padding: 10px;
}
.usergroupList .el-table td,.usergroupList .el-table th{
	padding: 8px 0;
	text-align: center;
}
.authTree .el-checkbox__inner{
	width: 20px;
	height: 20px;
}
.authTree .el-checkbox__inner::after{
	top: 4px;
	left: 7px;
}
.authTree .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
	top: 8px;
}
.authTree .el-tree-node__content{
	height: 30px;
}
.disableClass .el-button{
	width: 100px;
}
</style>
