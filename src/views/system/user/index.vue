<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>

            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable @keypress.enter.native="handleSearchList()"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="handleSearchList()" size="small">
                        查询搜索
                    </el-button>
                    <el-button  @click="handleResetSearch()" size="small">
                        重置
                    </el-button>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" type="primary" @click="handleAdd()" style="margin-left: 20px">添加用户</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="userTable" :data="list" row-key="id" style="width: 100%;" 
            height="565"
                :header-cell-style="{ background: '#304156', color: '#FFFFFF', 'font-size': 'initial', 'text-align': 'center'}"
                :cell-style="{color: '#606266', 'font-size': 'initial'}"
            v-loading="listLoading" border>
                <el-table-column label="序号" type="index" width="50" align="center">
                </el-table-column>
                <el-table-column label="用户名" align="center" >
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column label="工号" align="center" width="200">
                    <template slot-scope="scope">{{ scope.row.nickName }}</template>
                </el-table-column>
                <el-table-column label="邮箱" width="250">
                    <template slot-scope="scope">{{ scope.row.email }}</template>
                </el-table-column>
                <el-table-column label="部门" align="center" width="200">
                    <template slot-scope="scope">{{ scope.row.departmentName }}</template>
                </el-table-column>
                <el-table-column label="添加时间" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <!-- <el-table-column label="最后登录" width="160">
                    <template slot-scope="scope">{{ scope.row.loginTime | formatDateTime }}</template>
                </el-table-column> -->
                <el-table-column label="是否启用" align="center">
                    <template slot-scope="scope">
                        <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" active-color="#304156" inactive-color="red"
                            :inactive-value="0" v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center">
                    <template slot-scope="scope">
                        <el-link size="mini" type="primary" icon="el-icon-set-up" class="edit"
                            @click="handleSelectRole(scope.$index, scope.row)">分配角色</el-link>
                        <el-link size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row)" class="edit">编辑</el-link>
                        <el-link size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="isEdit ? '编辑用户' : '添加用户'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="user" ref="userForm" label-width="150px" size="small">
                <el-form-item label="用户名：">
                    <el-input v-model="user.userName" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="工号：">
                    <el-input v-model="user.nickName" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="user.email" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="user.password" type="text" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="隶属部门">
                    <el-popover ref="departmentListPopover" placement="bottom-start" trigger="click">
                        <el-tree :data="departmentDataList" :props="departmentListTreeProps" node-key="ldepartmentId"
                            ref="departmentListTree" @current-change="departmentListTreeCurrentChangeHandle"
                            :default-expand-all="true" :highlight-current="true" :expand-on-click-node="true">
                        </el-tree>
                    </el-popover>
                    <el-input v-model="user.departmentName" v-popover:departmentListPopover :readonly="true"
                        placeholder="点击选择上级部门"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="user.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="分配角色" :visible.sync="allocDialogVisible" width="30%">
            <el-select v-model="allocRoleIds" multiple value-key="id" placeholder="请选择" size="small" style="width: 80%">
                <el-option v-for="item in allRoleList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getUserList, createUser, updateUser, updateStatus, deleteUser, allocRole, getRoleByUser } from '@/api/user';
import { treeDataTranslate } from '@/utils';
import { getDepartDataList } from '@/api/department'
import { getAllRoleList } from '@/api/role';
import { mapGetters } from 'vuex';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultUser = {
    id: null,
    userName: null,
    password: '123456',
    nickName: null,
    email: null,
    departmentName: null,
    departmentId: null,
    status: 1
};
export default {
    name: 'User',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            departmentDataList: [],
            listLoading: false,
            dialogVisible: false,
            user: Object.assign({}, defaultUser),
            isEdit: false,
            allocDialogVisible: false,
            allocRoleIds: [],
            allRoleList: [{ id: '', roleName: '' }],
            allocUserId: null,
            departmentListTreeProps: {
                label: 'departmentName',
                children: 'children'
            }
        }
    },
    created() {
        this.getUserList();
        this.getRoleList();
        this.getDepartDataList();
    },
    computed: {
        ...mapGetters(['userid'])
    },
    methods: {
        getDepartDataList() {
            getDepartDataList().then(res => {
                if (res.success) {
                    this.departmentDataList = treeDataTranslate(res.data, 'departmentId');
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 菜单树选中
        departmentListTreeCurrentChangeHandle(data, node) {
            this.user.departmentName = data.departmentName;
            this.user.departmentId = data.departmentId;
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getUserList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getUserList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.user = Object.assign({}, defaultUser);

        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateStatus(row.id, { status: row.status }).then(response => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改'
                });
                this.getUserList();
            });
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteUser(row.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getUserList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.user = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    this.user.updateBy = this.userid;
                    updateUser(this.user).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getUserList();
                    })
                } else {
                    let obj = {};
                    //console.log(this.user);
                    obj.userName = this.user.userName;
                    obj.password = this.user.password;
                    obj.nickName = this.user.nickName;
                    obj.email = this.user.email;
                    obj.departmentId = this.user.departmentId;
                    obj.status = this.user.status;
                    obj.createBy = this.userid;
                    obj.updateBy = this.userid;
                    createUser(obj).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getUserList();
                    })
                }
            })
        },
        handleAllocDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                allocRole({ "userId": this.allocUserId, "roleId": this.allocRoleIds }).then(response => {
                    this.$message({
                        message: '分配成功！',
                        type: 'success'
                    });
                    this.allocDialogVisible = false;
                })
            })
        },
        handleSelectRole(index, row) {
            this.allocUserId = row.id;
            this.allocDialogVisible = true;
            this.getRoleListByUser(row.id);
        },
        getUserList() {
            //debugger
            this.listLoading = true;
            getUserList(this.listQuery).then(response => {
                this.listLoading = false;
                //debugger;
                this.list = response.data;
                this.total = response.dynamicData.total;
                //console.log(this.list);
            });
        },
        getRoleList() {
            getAllRoleList().then(response => {
                this.allRoleList = response.data;
                //console.log(this.allRoleList);
            });
        },
        getRoleListByUser(UserId) {
            getRoleByUser(UserId).then(response => {
                if (response.success) {
                    debugger
                    this.allocRoleIds = [];
                    if (response.data != null) {
                        for (var i = 0; i < response.data.length; i++) {
                            this.allocRoleIds.unshift(response.data[i].roleId);
                        }
                    }
                } else {
                    this.$message.error(response.msg)
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.app-container {
    .operate-container {
        background-color:cadetblue 
    }

    .filter-container {
        background-color: aquamarine;
    }
    .span{
        color: #e71818;
    }
}
.edit{
    color: #1b1f24;
    margin-right: 25px;
}
/* 奇数行的背景色为 #f9f9f9 */
::v-deep .el-table__row:nth-child(odd) {
    background-color: #d2d2d2;
  }
  /* 偶数行的背景色为 #ffffff */
::v-deep .el-table__row:nth-child(even) {
  background-color: #f4f4f4;
}

</style>
  
  