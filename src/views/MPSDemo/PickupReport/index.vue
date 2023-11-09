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
                    <el-form-item label="Line Name[线别]:">
                        <el-select v-model="alllistQuery.lineName" filterable default-first-option clearable
                            style="width: 200px;" placeholder="请选择线别">
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Component Number[原材料料号]:">
                        <el-input v-model="alllistQuery.componentNumber" placeholder="请输入原材料料号"
                            style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="Pickup Status[配料状态]:">
                        <el-select v-model="alllistQuery.pickupStatus" clearable placeholder="请选择配料状态"
                            style="width: 200px;">
                            <el-option v-for="item in pickupStatusOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pick Order Type[需求单类型]:">
                        <el-select v-model="alllistQuery.pickOrderType" clearable placeholder="请选择需求单类型"
                            style="width: 200px;">
                            <el-option v-for="item in pickOrderTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pickup Time[备料时间]:">
                        <el-date-picker v-model="alllistQuery.pickupTime" type="datetime" placeholder="请选择备料时间"
                            align="right" :picker-options="pickerOptions" style="width: 200px;"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Unique ID[CFM批次号]:">
                        <el-input v-model="alllistQuery.uniqueId" placeholder="请输入CFM批次号"
                            style="width: 200px;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card style="margin-top: 10px;" shadow="never">
            <div style="margin:0px 5px 0px 5px;">
                <i class="el-icon-tickets"></i>
                <span>{{ "\u3000" }}工具栏</span>
                <el-button type="primary" @click="handleSearchList()" round size="small" style="margin-left: 20px;">
                    <i class="el-icon-search"></i>搜索
                </el-button>
                <el-button type="info" @click="handleResetSearch()" round size="small">
                    <i class="el-icon-refresh-left"></i>重置
                </el-button>
            </div>
        </el-card>
        <div class="table-container" style="margin-top: 10px;">
            <vxe-table resizable show-overflow ref="xTable" border :loading="loading" :data="tableData"
                :row-config="{ isCurrent: true, isHover: true }" height="550">
                <vxe-column type="seq" width="60"></vxe-column>
                <vxe-column field="pickOrderId" title="Pick Order[物料需求订单]" width="196px"></vxe-column>
                <vxe-column field="line" title="Line[线别]" width="90px"></vxe-column>
                <vxe-column field="partNumber" title="Product Number[PCBA料号]" width="140px"></vxe-column>
                <vxe-column field="workOrder" title="Work Order[工单]" width="100px"></vxe-column>
                <vxe-column field="componentNumber" title="ComponentNumber[原材料料号]" width="160px"></vxe-column>
                <vxe-column field="uniqueId" title="UniqueID[CFM批次号]" width="270px"></vxe-column>
                <vxe-column field="created" title="Order Time[订单时间]" width="165px"></vxe-column>
                <vxe-column field="pickupDateTime" title="Pickup Time[配料时间]" width="165px"></vxe-column>
                <vxe-column field="pickOrderType" title="Order Type[订单类型]" width="100px">
                    <template #default="{ row }">
                        <span v-if="row.pickOrderType === 4">Auto</span>
                        <span v-else-if="row.pickOrderType === 5">Manual</span>
                        <span v-else>Not Defined</span>
                    </template>
                </vxe-column>
                <vxe-column field="pickupStatus" title="Pickup Status[配料状态]" width="110px">
                    <template #default="{ row }">
                        <span v-if="row.pickupStatus == 10">Opened</span>
                        <span v-else-if="row.pickupStatus == 20">Picked</span>
                        <span v-else-if="row.pickupStatus == 30">Completed</span>
                        <span v-else-if="row.pickupStatus == 40">Transfer</span>
                        <span v-else-if="row.pickupStatus == 50">Received</span>
                        <span v-else-if="row.pickupStatus == -10">Closed</span>
                        <span v-else-if="row.pickupStatus == -20">Cancelled</span>
                    </template>
                </vxe-column>
                <vxe-column field="track" title="Track[Track]" width="256px"></vxe-column>
                <vxe-column field="batchNo" title="DateCode[DateCode]" width="165px"></vxe-column>
                <vxe-column field="inventory" title="Inventory[仓库库位]" width="100px"></vxe-column>
                <vxe-column field="smtMachine" title="Machine[机台]"  width="165px"></vxe-column>
                <vxe-column field="smtSide" title="Side[内外侧]"  width="100px"></vxe-column>
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
import { fetchPickupList } from '@/api/MPSKanban';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    componentNumber: null,
    uniqueId: null,
    pickupTime: null,
    pickupStatus: null,
    pickOrderType: null,
    lineName: null,

};
export default {
    name: 'PickupReport',
    data() {
        return {
            tableData: [],
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
                    value: 4
                },
                {
                    label: "Manual",
                    value: 5
                },
            ],
            pickupStatusOptions: [
                {
                    label: "Opened",
                    value: 10
                },
                {
                    label: "Closed",
                    value: -10
                },
                {
                    label: "Picked",
                    value: 20
                },
                {
                    label: "Cancelled",
                    value: -20
                },
                {
                    label: "Completed",
                    value: 30
                },
                {
                    label: "Transfer",
                    value: 40
                },
                {
                    label: "Received",
                    value: 50
                },
            ],
            alllistQuery: Object.assign({}, defaultListQuery),
            lineList: [],
            fromLaberWidth: '250px',
            total: 9,
            loading: false,
        }
    },
    created() {
        this.getLineList();
        this.fetchList();
    },
    methods: {
        handleSearchList() {
            this.alllistQuery.pageNum = 1;
            this.fetchList();
        },
        handleResetSearch() {
            this.alllistQuery = Object.assign({}, defaultListQuery);
        },
        handleSizeChange(val) {
            this.alllistQuery.pageNum = 1;
            this.alllistQuery.pageSize = val;
            this.fetchList();
        },
        handleCurrentChange(val) {
            this.alllistQuery.pageNum = val;
            this.fetchList();
        },
        /**
         * 获取分页数据
         */
        fetchList() {
            this.loading = true;
            if (this.alllistQuery.pickOrderType == null) {
                this.alllistQuery.pickOrderType = 0;
            }
            if (this.alllistQuery.pickupStatus == null) {
                this.alllistQuery.pickupStatus = 0;
            }
            fetchPickupList(this.alllistQuery).then(response => {
                if (response.success) {
                    this.tableData = response.data;
                    this.total = response.dynamicData.total;
                    this.loading = false;
                    if (this.alllistQuery.pickOrderType == 0) {
                        this.alllistQuery.pickOrderType = null;
                    }
                    if (this.alllistQuery.pickupStatus == 0) {
                        this.alllistQuery.pickupStatus = null;
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: response.msg
                    });
                    if (this.alllistQuery.pickOrderType == 0) {
                        this.alllistQuery.pickOrderType = null;
                    }
                    if (this.alllistQuery.pickupStatus == 0) {
                        this.alllistQuery.pickupStatus = null;
                    }
                    this.loading = false;
                }
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
                        if (element.lineName.includes('SMT')) {
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
<style lang="scss" scoped>
.expand-wrapper {
    padding: 20px;
}

.pagination-container {
    margin-top: 10px;
    padding-bottom: 30px;
}
</style>