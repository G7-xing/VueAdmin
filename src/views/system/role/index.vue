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
                        <el-input v-model="listQuery.keyword" @keyup.native.enter="handleSearchList()" class="input-width"
                            placeholder="角色名称" clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="handleSearchList()" size="small">
                        查询搜索
                    </el-button>
                    <el-button @click="handleResetSearch()" size="small">
                        重置
                    </el-button>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="roleTable" :data="list" row-key="id" style="width: 100%;" v-loading="listLoading" border>
                <el-table-column label="序号" type="index" width="80" align="center">
                </el-table-column>
                <el-table-column label="角色名称" align="center" width="240">
                    <template slot-scope="scope">{{ scope.row.roleName }}</template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
                </el-table-column>
                <!-- <el-table-column label="用户数" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.count }}</template>
                </el-table-column> -->
                <el-table-column label="添加时间" width="240" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column label="是否启用" width="140" align="center">
                    <template slot-scope="scope">
                        <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1"
                            :inactive-value="0" v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button size="mini" type="warning" icon="el-icon-star-off"
                                @click="handleSelectMenu(scope.$index, scope.row)">分配菜单
                            </el-button>
                            <el-button size="mini" type="primary" icon="el-icon-edit"
                                @click="handleUpdate(scope.$index, scope.row)">
                                编辑
                            </el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                            <!-- <el-button size="mini" type="text" @click="handleSelectResource(scope.$index, scope.row)">分配资源
                            </el-button> -->
                        </el-row>
                        <el-row>

                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="role" ref="roleForm" label-width="150px" size="small">
                <el-form-item label="角色名称：">
                    <el-input v-model="role.roleName" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input v-model="role.roleDesc" type="textarea" :rows="5" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="role.status">
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

        <el-dialog class="form-container" :visible.sync="menuCard" @close="handleClear()">
            <el-tree :data="menuTreeList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
                :props="defaultProps">
            </el-tree>
            <div style="margin-top: 20px" align="center">
                <el-button type="primary" @click="handleSave()">保存</el-button>
                <el-button @click="handleClear()">清空</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { fetchList, createRole, updateRole, updateStatus, deleteRole, allocMenu, listMenuByRole } from '@/api/role';
import { getMenuList } from '@/api/menu';
import { treeDataTranslate } from '@/utils';
//import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    keyword: null
};
const defaultRole = {
    id: null,
    roleName: null,
    roleDesc: null,
    count: 0,
    status: 1,
};
export default {
    name: 'Role',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            role: Object.assign({}, defaultRole),
            isEdit: false,
            menuCard: false,
            menuTreeList: [],
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            roleId: ''
        }
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapGetters(['userid'])
    },
    filters: {
        formatDateTime(time) {
            if (time == null || time === '') {
                return 'N/A';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
    },
    methods: {
        getMenuListad() {
            getMenuList().then(res => {
                if (res.success) {
                    this.menuTreeList = treeDataTranslate(res.data, 'id');
                } else {
                    this.$message.error(res.msg)
                }

            })
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.role = Object.assign({}, defaultRole);
        },
        handleStatusChange(index, row) {
            //debugger;
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateStatus({ status: row.status, id: row.id, updateBy: this.userid }).then(response => {
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
                this.getList();
            });
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = [];
                ids.push(row.id);
                let params = new URLSearchParams();
                params.append("ids", ids);
                deleteRole(params).then(response => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.role = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    this.role.updateBy = this.userid;
                    updateRole(this.role).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                } else {
                    let obj = {};
                    obj.roleName = this.role.roleName;
                    obj.roleDesc = this.role.roleDesc;
                    obj.status = this.role.status;
                    obj.createBy = this.userid;
                    createRole(obj).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                }
            })
        },
        handleSelectMenu(index, row) {
            this.menuCard = true;
            this.roleId = row.id;
            getMenuList().then(res => {
                if (res.success) {
                    this.menuTreeList = treeDataTranslate(res.data, 'id');
                    listMenuByRole(this.roleId).then(response => {
                        let menuList = response.data;
                        let checkedMenuIds = [];
                        if (menuList != null && menuList.length > 0) {
                            for (let i = 0; i < menuList.length; i++) {
                                checkedMenuIds.push(menuList[i].menuId);
                            }
                        }
                        this.$refs.tree.setCheckedKeys(checkedMenuIds);
                    })

                } else {
                    this.$message.error(res.msg)
                }

            });
        },
        handleSave() {
            let checkedNodes = this.$refs.tree.getCheckedNodes();
            let checkedMenuIds = new Set();
            if (checkedNodes != null && checkedNodes.length > 0) {
                for (let i = 0; i < checkedNodes.length; i++) {
                    let checkedNode = checkedNodes[i];
                    checkedMenuIds.add(checkedNode.id);
                    // if (checkedNode.parentId !== 0) {
                    //     checkedMenuIds.add(checkedNode.parentId);
                    // }
                }
            }
            this.$confirm('是否分配菜单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                allocMenu({ "roleId": this.roleId, "menuIds": Array.from(checkedMenuIds) }).then(response => {
                    this.$message({
                        message: '分配成功',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.menuCard = false;
                            this.getList();
                        }
                    });
                    //this.$router.back();
                })
            })
        },
        handleClear() {
            this.$refs.tree.setCheckedKeys([]);
        },
        handleSelectResource(index, row) {
           // this.$router.push({ path: '/ums/allocResource', query: { roleId: row.id } })
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data;
                this.total = response.dynamicData.total;
            });
        }
    }
}
</script>
<style></style>
  
  
  