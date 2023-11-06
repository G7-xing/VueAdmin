<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div style="margin-top: -10px;">
                <i class="el-icon-search"></i>
                <span>{{ "\u3000" }}筛选搜索</span>
            </div>
            <div style="margin: 10px 10px -10px 0px;">
                <el-form :inline="true" :model="alllistQuery" size="medium" class="demo-form-inline" label-position="right"
                    :label-width="fromLaberWidth">
                    <el-form-item label="Pick Order Number[物料需求订单号]:">
                        <el-input v-model="alllistQuery.listQuery.pickOrderNumber" placeholder="请输入物料需求订单号"
                            style="width: 13rem;"></el-input>
                    </el-form-item>
                    <el-form-item label="PCBA Number[PCBA料号]:">
                        <el-input v-model="alllistQuery.listQuery.pcbaNumber" placeholder="请输入PCBA料号"
                            style="width: 13rem;"></el-input>
                    </el-form-item>
                    <el-form-item label="Created Time[创建时间]:">
                        <el-date-picker v-model="alllistQuery.listQuery.createdTime" type="datetime" placeholder="请选择创建时间"
                            align="right" :picker-options="pickerOptions" style="width: 13rem;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Pick Order Type[需求单类型]:">
                        <el-select v-model="alllistQuery.listQuery.pickOrderType" clearable placeholder="请选择需求单类型"
                            style="width: 13rem;">
                            <el-option v-for="item in pickOrderTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pick Order Status[需求单状态]:">
                        <el-select v-model="alllistQuery.listQuery.pickOrderStatus" clearable placeholder="请选择需求单状态"
                            style="width: 13rem;">
                            <el-option v-for="item in pickOrderStatusOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Line Name[线别]:">
                        <el-select v-model="alllistQuery.listQuery.lineId" filterable default-first-option clearable
                            style="width: 13rem;" placeholder="请选择线别">
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="handleSearchList()" round size="small">
                        <i class="el-icon-search"></i>搜索
                    </el-button>
                    <el-button type="info" @click="handleResetSearch()" round size="small">
                        <i class="el-icon-refresh-left"></i>重置
                    </el-button>
                </el-form>
            </div>
        </el-card>
        <div class="table-container" style="margin-top: 2rem;">
            <vxe-table ref="xTable" border :loading="loading"
                :expand-config="{ iconOpen: 'vxe-icon-square-minus', iconClose: 'vxe-icon-square-plus', toggleMethod: toggleExpandMethod }"
                :data="tableData" height="550">
                <vxe-column type="seq" width="60"></vxe-column>
                <vxe-column type="expand" title="Pick Order[物料需求订单]">
                    <template #default="{ row }">
                        <span>{{ row.name }}</span>
                    </template>
                    <template #content="{ }">
                        <div class="expand-wrapper">
                            <vxe-table border :data="tableData">
                                <vxe-column field="role" title="Component Number"></vxe-column>
                                <vxe-column field="age" title="Picked UniqueId"></vxe-column>
                                <vxe-column field="age" title="Required Qty"></vxe-column>
                                <vxe-column field="age" title="Pick Status"></vxe-column>
                                <vxe-column field="age" title="Pick Status"></vxe-column>
                                <vxe-column field="age" title="Machine"></vxe-column>
                                <vxe-column field="age" title="Machine"></vxe-column>
                            </vxe-table>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column field="sex" title="Line[线别]"></vxe-column>
                <vxe-column field="age" title="Work Order[工单]"></vxe-column>
                <vxe-column field="age" title="Created Time[创建时间]"></vxe-column>
                <vxe-column field="age" title="Required Time[需求时间]"></vxe-column>
                <vxe-column field="age" title="Pick Order Type[订单类型]"></vxe-column>
                <vxe-column field="age" title="Pick Order Type[订单类型]"></vxe-column>
            </vxe-table>
            <div class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="total, sizes,prev, pager, next,jumper" :current-page.sync="alllistQuery.pageNum"
                    :page-size="alllistQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { fetchAllList } from '@/api/line';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    listQuery: {
        pickOrderNumber: null,
        pcbaNumber: null,
        createdTime: null,
        pickOrderType: null,
        pickOrderStatus: null,
        lineId: null,
    }
};
export default {
    name: 'PickOrderHistory',
    data() {
        return {
            tableData: [
                { id: 10001, name: 'Test1', role: 'Develop', sex: '0', age: 28, address: 'test abc' },
                { id: 10002, name: 'Test2', role: 'Test', sex: '1', age: 22, address: 'Guangzhou' },
                { id: 10003, name: 'Test3', role: 'PM', sex: '0', age: 32, address: 'Shanghai' },
                { id: 10004, name: 'Test4', role: 'Designer', sex: '1', age: 23, address: 'test abc' },
                { id: 10005, name: 'Test5', role: 'Develop', sex: '1', age: 30, address: 'Shanghai' },
                { id: 10006, name: 'Test6', role: 'Designer', sex: '1', age: 21, address: 'test abc' }
            ],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
            },
            pickOrderTypeOptions: [
                {
                    label: "Auto",
                    value: "4"
                },
                {
                    label: "Manual",
                    value: "5"
                },
            ],
            pickOrderStatusOptions: [
                {
                    label: "Open",
                    value: "10"
                },
                {
                    label: "Processing",
                    value: "20"
                },
                {
                    label: "Complete",
                    value: "30"
                },
                {
                    label: "Done",
                    value: "40"
                },
            ],
            alllistQuery: Object.assign({}, defaultListQuery),
            lineList: [],
            fromLaberWidth: '15.78rem',
            total: 9,
            loading: false,
        }
    },
    created() {
        this.getLineList();
    },
    methods: {
        handleSearchList() {
            this.alllistQuery.pageNum = 1;
            //this.fetchList();
        },
        handleResetSearch() {
            this.alllistQuery.listQuery = {};
        },
        toggleExpandMethod({ expanded, row }) {

            return true
        },
        handleSizeChange(val) {
            this.alllistQuery.pageNum = 1;
            this.alllistQuery.pageSize = val;
            // this.fetchList();
        },
        handleCurrentChange(val) {
            this.alllistQuery.pageNum = val;
            //this.fetchList();
        },
        getList() {
            this.listLoading = true;
            fetchHistoryList(this.alllistQuery).then(response => {
                debugger
                const { data, total } = response.data;
            });
        },
        /**
         * 获取线体只保留smt
         * @returns {Promise<void>}
         */
        getLineList() {
            fetchAllList().then(res => {
                if (res.success) {
                    res.data.forEach(element => {
                        let value = element.lineId;
                        if (element.lineName.includes( 'SMT' )){
                            let label = element.lineName;
                            this.lineList.push({ value, label });
                        }
                        
                    });
                }
            })
        },

    },
}
</script>
<style lang="scss">
.expand-wrapper {
    padding: 20px;
}

.pagination-container {
    margin-top: 10px;
    padding-bottom: 30px;
}
</style>