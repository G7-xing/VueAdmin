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
                        <el-input v-model="listQuery.keyword" placeholder="小车编号" clearable
                            @keydown.enter.native="handleSearchList()"></el-input>
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
            <el-button size="mini" @click="handleAdd()" style="margin-left: 20px">添加小车</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="carTable" :data="list" row-key="wipCarId" style="width: 100%;" size="small" height="565"
                :header-cell-style="{ background: '#304156', color: '#FFFFFF', 'font-size': 'initial' }"
                :cell-style="{ color: '#606266', 'font-size': 'initial' }" v-loading="listLoading" border>
                <el-table-column label="序号" align="center" type="index" width="60">
                </el-table-column>
                <el-table-column label="小车编号" align="center">
                    <template slot-scope="scope">{{ scope.row.carNo }}</template>
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
                            active-color="#304156" inactive-color="red" :inactive-value="0" v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-link size="mini" type="primary" icon="el-icon-edit" class="edit"
                            @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-link>
                        <el-link size="mini" type="danger" icon="el-icon-delete" style="padding-top: auto;"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-link>
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
        <el-dialog :title="isEdit ? '编辑小车' : '添加小车'" :visible.sync="dialogVisible" width="35%">
            <el-form :model="car" ref="carForm" label-width="150px" size="small">
                <el-form-item label="小车编号：">
                    <el-input v-model="car.carNo" style="width: 200px;"></el-input>*类似于XX00
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="car.status">
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
import { fetchCarList, createCar, updateCar, updateCarStatus, deleteCar } from '@/api/WipStorage';
import { mapGetters } from 'vuex'
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultcar = {
    wipCarId: null,
    wipCarNo: null,
    status: 1,
    createBy: '',
    updateBy: ''
};
export default {
    name: 'wipCarInfo',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            car: Object.assign({}, defaultcar),
            isEdit: false,
            allocDialogVisible: false,
        }
    },
    created() {
        //this.fetchList();
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
            this.car = Object.assign({}, defaultcar);
        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateCarStatus(row.wipCarId, row.status).then(res => {
                    if (res.success) {
                        this.$message({
                            message: '修改状态成功！',
                            type: 'success'
                        });
                        this.fetchList();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
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
                deleteCar(row.wipCarId).then(res => {
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.fetchList();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.car = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    this.car.updateBy = this.userid;
                    updateCar(this.car).then(res => {
                        if (res.success) {
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.dialogVisible = false;
                            this.fetchList();
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    this.car.createBy = this.userid;
                    this.car.updateBy = this.userid;
                    //console.log(this.car);
                    createCar(this.car).then(res => {
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
            fetchCarList(this.listQuery).then(response => {
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
        background-color: cadetblue
    }

    .filter-container {
        background-color: aquamarine;
    }
}

.edit {
    color: #1b1f24;
    margin-right: 25px;
}

/* 奇数行的背景色为 #f9f9f9 */
::v-deep .el-table__row:nth-child(odd) {
    background-color: #fcfcfc;
}

/* 偶数行的背景色为 #ffffff */
::v-deep .el-table__row:nth-child(even) {
    background-color: #f4f4f4;
}
</style>
  
  
  