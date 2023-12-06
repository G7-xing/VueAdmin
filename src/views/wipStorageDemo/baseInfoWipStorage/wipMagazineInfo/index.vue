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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="Magazine名称"
                            clearable @keydown.enter.native="handleSearchList()"></el-input>
                    </el-form-item>
                    <el-button  type="primary" @click="handleSearchList()" size="small">
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
            <!-- <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button> -->
        </el-card>
        <div class="table-container">
            <el-table ref="lineTable" :data="list" row-key="id" height="565" 
                :header-cell-style="{ background: '#304156', color: '#FFFFFF', 'font-size': 'initial' }" highlight-current-row
                :cell-style="{ color: '#606266', 'font-size': 'initial' }" style="width: 100%;" size="small"
                v-loading="listLoading" border>
                <el-table-column label="序号" align="center" type="index">
                </el-table-column>
                <el-table-column label="Magazine名称" align="center">
                    <template slot-scope="scope">{{ scope.row.magazineNo }}</template>
                </el-table-column>
                <el-table-column label="添加时间" align="center">
                    <template slot-scope="scope">{{ scope.row.purchaseDate }}</template>
                </el-table-column>
                <el-table-column label="有效天数" align="center">
                    <template slot-scope="scope">{{ scope.row.validDays }}</template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </div>
        <!-- <el-dialog :title="isEdit ? '编辑Magazine' : '添加Magazine'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="line" ref="lineForm" label-width="150px" size="small">
                <el-form-item label="Magazine名称：">
                    <el-input v-model="line.lineName" width="100%"></el-input>
                </el-form-item>
                <el-form-item label="Magazine分类：">
                    <el-select v-model="line.lineCategory" placeholder="请选择Magazine分类">
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
        </el-dialog> -->
    </div>
</template>
<script>
import { fetchMagazineList } from '@/api/WipStorage';
import { mapGetters } from 'vuex'
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
// const defaultLine = {
//     lineId: null,
//     lineName: null,
//     lineCategory: null,
//     status: 1,
//     createBy: '',
//     updateBy: ''
// };
export default {
    name: 'wipMagazineInfo',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            // line: Object.assign({}, defaultLine),
            // isEdit: false,
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
        // handleStatusChange(index, row) {
        //     this.$confirm('是否要修改该状态?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         updateStatus(row.id, { status: row.status }).then(response => {
        //             this.$message({
        //                 type: 'success',
        //                 message: '修改成功!'
        //             });
        //         });
        //     }).catch(() => {
        //         this.$message({
        //             type: 'info',
        //             message: '取消修改'
        //         });
        //         this.fetchList();
        //     });
        // },
        // handleDelete(index, row) {
        //     this.$confirm('是否要删除该用户?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         deleteAdmin(row.id).then(response => {
        //             this.$message({
        //                 type: 'success',
        //                 message: '删除成功!'
        //             });
        //             this.fetchList();
        //         });
        //     });
        // },
        // handleUpdate(index, row) {
        //     this.dialogVisible = true;
        //     this.isEdit = true;
        //     this.line = Object.assign({}, row);
        // },
        // handleDialogConfirm() {
        //     this.$confirm('是否要确认?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         if (this.isEdit) {
        //             // this.line.createBy = this.userid;
        //             this.line.updateBy = this.userid;
        //             updateLine(this.line).then(response => {
        //                 this.$message({
        //                     message: '修改成功！',
        //                     type: 'success'
        //                 });
        //                 this.dialogVisible = false;
        //                 this.fetchList();
        //             })
        //         } else {
        //             this.line.createBy = this.userid;
        //             this.line.updateBy = this.userid;
        //             //console.log(this.line);
        //             createLine(this.line).then(res => {
        //                 if (res.success) {
        //                     this.$message({
        //                         message: '添加成功！',
        //                         type: 'success'
        //                     });
        //                     this.dialogVisible = false;
        //                     this.fetchList();
        //                 } else {
        //                     this.$message({
        //                         message: res.msg,
        //                         type: 'error'
        //                     });
        //                     //this.dialogVisible = false;
        //                     this.fetchList();
        //                 }

        //             })
        //         }
        //     })
        // },
        fetchList() {
            this.listLoading = true;
            fetchMagazineList(this.listQuery).then(response => {
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
    background-color: #d2d2d2;
}

/* 偶数行的背景色为 #ffffff */
::v-deep .el-table__row:nth-child(even) {
    background-color: #f4f4f4;
}


</style>
  
  
  