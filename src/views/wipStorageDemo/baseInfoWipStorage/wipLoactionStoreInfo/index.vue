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
                        <el-input v-model="listQuery.keyword" placeholder="库位编号" clearable
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
            <el-button size="mini" @click="handleAdd()" style="margin-left: 20px">添加库位</el-button>
            <el-button size="mini" @click="handleBatchAdd()" style="margin-left: 20px">批量添加库位</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="carTable" :data="list" row-key="wipStorageLocationId" style="width: 100%;" size="small"
                height="565" :header-cell-style="{ background: '#304156', color: '#FFFFFF', 'font-size': 'initial' }"
                :cell-style="{ color: '#606266', 'font-size': 'initial' }" v-loading="listLoading" border>
                <el-table-column label="序号" align="center" type="index" width="60">
                </el-table-column>
                <el-table-column label="库位编号" align="center">
                    <template slot-scope="scope">{{ scope.row.locationNo }}</template>
                </el-table-column>
                <el-table-column label="库位区域" align="center">
                    <template slot-scope="scope">{{ scope.row.areaName + '———' + scope.row.areaLineName }}</template>
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
        <el-dialog :title="isEdit ? '编辑库位' : '添加库位'" :visible.sync="dialogVisible" width="35%">
            <el-form :model="wipStorageLocation" ref="locationForm" :rules="rules" label-width="150px" size="small">
                <el-form-item label="库位编号：" prop="locationNo">
                    <el-input v-model="wipStorageLocation.locationNo" style="width: 215px;"></el-input>*类似于XX00
                </el-form-item>
                <el-form-item label="库位区域选择：" prop="wipLocationAreaId">
                    <el-select v-model="wipStorageLocation.wipLocationAreaId" placeholder="请选择" filterable clearable>
                        <el-option v-for="item in wipLocationArea" :key="item.wipLocationAreaId"
                            :label="`${item.areaName}_____${item.areaLineName}`" :value="item.wipLocationAreaId">
                            <span style="float: left">{{ item.areaName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.areaLineName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio-group v-model="wipStorageLocation.status">
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

        <el-dialog title="批量添加库位" :visible.sync="dialogVisibleBatch" width="35%">
            <el-form :model="wipStorageLocationBatchFrom" ref="locationBatchForm" label-width="150px" size="small">
                <el-form-item label="库位字母编号：" prop="locationCharNo">
                    <el-input v-model="wipStorageLocationBatchFrom.locationCharNo"
                        style="width: 100px;"></el-input>*类似AA且必须为两位大写字母
                </el-form-item>
                <el-form-item label="库位数量：" prop="charNum">
                    <el-input-number v-model="wipStorageLocationBatchFrom.charNum" :min="2"
                        :max="99"></el-input-number>*与字母组合的流水个数
                </el-form-item>
                <el-form-item label="库位区域选择：" prop="wipLocationAreaId">
                    <el-select v-model="wipStorageLocationBatchFrom.wipLocationAreaId" placeholder="请选择" filterable
                        clearable>
                        <el-option v-for="item in wipLocationArea" :key="item.wipLocationAreaId"
                            :label="`${item.areaName}_____${item.areaLineName}`" :value="item.wipLocationAreaId">
                            <span style="float: left">{{ item.areaName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.areaLineName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio-group v-model="wipStorageLocationBatchFrom.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirmBatch()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { fetchLocationList, createLocation, updateLocation, updateLocationStatus, deleteLocation, fectchLocationArea,createBatchLocation } from '@/api/WipStorage';
import { mapGetters } from 'vuex'
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultLocation = {
    wipStorageLocationId: null,
    locationNo: null,
    wipLocationAreaId: null,
    status: 1,
    createBy: '',
    updateBy: ''
};
const defaultLocationBatchFrom = {
    wipStorageLocationId: null,
    locationCharNo: null,
    charNum: 2,
    wipLocationAreaId: null,
    status: 1,
    createBy: '',
    updateBy: ''
};
export default {
    name: 'wipStorageLocationInfo',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            wipStorageLocation: Object.assign({}, defaultLocation),
            isEdit: false,
            wipLocationArea: [],
            dialogVisibleBatch: false,
            wipStorageLocationBatchFrom: Object.assign({}, defaultLocationBatchFrom),
            // 表单校验
            rules: {
                locationNo: [
                    { required: true, message: "必须填写", trigger: 'blur' },
                    { min: 0, max: 4, message: "长度在 0 到 4 个字符", trigger: 'blur' }
                ],
                wipLocationAreaId: [
                    { required: true, message: '请选择一个选项', trigger: 'change' },
                ],
            }
        }
    },
    created() {
        this.fetchList();
        fectchLocationArea().then(res => {
            this.wipLocationArea = res.data;
        });
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
            this.wipStorageLocation = Object.assign({}, defaultLocation);
        },
        handleBatchAdd() {
            this.dialogVisibleBatch = true;
            this.wipStorageLocationBatchFrom = Object.assign({}, defaultLocationBatchFrom);

        },
        handleDialogConfirmBatch() {
            let locationBatch = [];
            let locationCharNo = this.wipStorageLocationBatchFrom.locationCharNo;
            for (let i = 1; i <= this.wipStorageLocationBatchFrom.charNum; i++) {
                let numNo = i > 10 ? i : '0' + i;
                locationBatch.unshift({
                    locationNo: locationCharNo + numNo,
                    wipLocationAreaId: this.wipStorageLocationBatchFrom.wipLocationAreaId,
                    updateBy: this.userid,
                    createBy: this.userid
                });
            }
            createBatchLocation(locationBatch).then(res => {
                res.success ? this.$message({ message: '批量添加成功！', type: 'success' }) : this.$message({ message: res.msg, type: 'error' });
                this.dialogVisibleBatch = false;
                this.fetchList();
            });
        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateLocationStatus({ wipStorageLocationId: row.wipStorageLocationId, status: row.status, updateBy: this.userid }).then(res => {
                    res.success ? this.$message({ message: '修改状态成功！', type: 'success' }) : this.$message({ message: res.msg, type: 'error' });
                    this.fetchList();
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '取消修改' });
                this.fetchList();
            });
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该用户?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                deleteLocation(row.wipStorageLocationId).then(res => {
                    res.success ? this.$message({ message: '删除成功!', type: 'success' }) : this.$message({ message: res.msg, type: 'error' });
                    this.fetchList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.wipStorageLocation = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    this.wipStorageLocation.updateBy = this.userid;
                    updateLocation(this.wipStorageLocation).then(res => {
                        res.success ? this.$message({ message: '修改成功！', type: 'success' }) : this.$message({ message: res.msg, type: 'error' });
                        this.dialogVisible = false;
                        this.fetchList();
                    })
                } else {
                    this.wipStorageLocation.createBy = this.userid;
                    this.wipStorageLocation.updateBy = this.userid;
                    delete this.wipStorageLocation.wipStorageLocationId;
                    createLocation(this.wipStorageLocation).then(res => {
                        res.success ? this.$message({ message: '添加成功！', type: 'success' }) : this.$message({ message: res.msg, type: 'error' });
                        this.dialogVisible = false;
                        this.fetchList();
                    })
                }
            })
        },
        fetchList() {
            this.listLoading = true;
            fetchLocationList(this.listQuery).then(response => {
                if (response.success) {
                    this.listLoading = false;
                    this.list = response.data;
                    this.total = response.dynamicData.total;
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
  
  
  