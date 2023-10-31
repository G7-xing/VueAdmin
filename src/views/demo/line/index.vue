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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="线体名称" clearable></el-input>
                    </el-form-item>
                    <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
                        查询搜索
                    </el-button>
                    <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
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
            <el-table ref="lineTable" :data="list" row-key="lineId" style="width: 100%;" size="small"
                v-loading="listLoading" border>
                <el-table-column label="序号" align="center" type="index">
                </el-table-column>
                <el-table-column label="线体名称" align="center">
                    <template slot-scope="scope">{{ scope.row.lineName }}</template>
                </el-table-column>
                <el-table-column label="线体分类" align="center">
                    <template slot-scope="scope">{{ scope.row.lineCategory }}</template>
                </el-table-column>
                <el-table-column label="添加时间" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column label="添加人" align="center">
                    <template slot-scope="scope">{{ scope.row.createBy }}</template>
                </el-table-column>
                <el-table-column label="更新时间" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column label="更新人" align="center">
                    <template slot-scope="scope">{{ scope.row.createBy }}</template>
                </el-table-column>
                <el-table-column label="是否启用" align="center">
                    <template slot-scope="scope">
                        <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1"
                            :inactive-value="0" v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" class="edit"
                            @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" style="padding-top: auto;"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
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
        <el-dialog :title="isEdit ? '编辑线体' : '添加线体'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="line" ref="lineForm" label-width="150px" size="small">
                <el-form-item label="线体名称：">
                    <el-input v-model="line.lineName" width="100%"></el-input>
                </el-form-item>
                <el-form-item label="线体分类：">
                    <el-select v-model="line.lineCategory" placeholder="请选择线体分类">
                        <el-option v-for="item in lineCategoryList" :key="item.value" :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="line.status">
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
    </div>
</template>
<script>
import { fetchList, createLine, updateLine, updateStatus, deleteLine } from '@/api/line';
import { mapGetters } from 'vuex'
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultLine = {
    lineId: null,
    lineName: null,
    lineCategory: null,
    status: 1,
    createBy: '',
    updateBy: ''
};
export default {
    name: 'LineManage',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            line: Object.assign({}, defaultLine),
            isEdit: false,
            allocDialogVisible: false,
            lineCategoryList: [
                { label: 'SMT', value: '00' },
                { label: 'ASSY', value: '11' },
                { label: 'Offline', value: '22' },
            ],
        }
    },
    created() {
        this.fetchList();
    },
    computed: {
        ...mapGetters(['userid'])
    },
    methods: {
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.fetchList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.fetchList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.fetchList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.line = Object.assign({}, defaultLine);
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
                this.fetchList();
            });
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAdmin(row.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.fetchList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.line = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    // this.line.createBy = this.userid;
                    this.line.updateBy = this.userid;
                    updateLine(this.line).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.fetchList();
                    })
                } else {
                    this.line.createBy = this.userid;
                    this.line.updateBy = this.userid;
                    //console.log(this.line);
                    createLine(this.line).then(res => {
                        if (res.success) {
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.dialogVisible = false;
                            this.fetchList();
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                            //this.dialogVisible = false;
                            this.fetchList();
                        }

                    })
                }
            })
        },
        fetchList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                if (response.success) {
                    this.listLoading = false;
                    this.list = response.data;
                    this.total = response.dynamicData.total;
                    //console.log(this.list);
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }

            });
        },
    }
}
</script>
<style lang="scss" scoped>
.app-container {
    .operate-container {
        .edit {
            margin-right: 100px;
        }
    }
}
</style>
  
  
  