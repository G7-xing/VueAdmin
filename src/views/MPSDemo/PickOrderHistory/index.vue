<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div style="margin-top: -10px;">
                <i class="el-icon-search"></i>
                <span>{{ "\u3000" }}筛选搜索</span>
            </div>
            <div style="margin: 10px 10px -10px 0px;">
                <el-form :inline="true" :model="alllistQuery" size="medium" class="demo-form-inline" label-position="center"
                    :label-width="fromLaberWidth">
                    <el-form-item label="Pick Order Number[需求订单号]:">
                        <el-input v-model="alllistQuery.pickOrderNumber" placeholder="请输入物料需求订单号"
                            style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="PCBA Number[PCBA料号]:">
                        <el-input v-model="alllistQuery.pcbaPartNumber" placeholder="请输入PCBA料号"
                            style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="Created Time[创建时间]:">
                        <el-date-picker v-model="alllistQuery.createdTime" type="datetime" placeholder="请选择创建时间"
                            align="right" :picker-options="pickerOptions" style="width: 200px;"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Pick Order Type[需求单类型]:">
                        <el-select v-model="alllistQuery.pickOrderType" clearable placeholder="请选择需求单类型"
                            style="width: 200px;">
                            <el-option v-for="item in pickOrderTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pick Order Status[需求单状态]:">
                        <el-select v-model="alllistQuery.pickOrderStatus" clearable placeholder="请选择需求单状态"
                            style="width: 200px;">
                            <el-option v-for="item in pickOrderStatusOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Line Name[线别]:">
                        <el-select v-model="alllistQuery.lineName" filterable default-first-option clearable
                            style="width: 200px;" placeholder="请选择线别">
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.label">
                            </el-option>
                        </el-select>
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
            <vxe-table ref="xTable" border :loading="loading" :row-config="{ isHover:true}"
                :expand-config="{ iconOpen: 'vxe-icon-square-minus', iconClose: 'vxe-icon-square-plus', toggleMethod: toggleExpandMethod }"
                :data="tableData" height="550" >
                <vxe-column type="seq" width="60"></vxe-column>
                <vxe-column type="expand" title="Pick Order[物料需求订单]">
                    <template #default="{ row }">
                        <span>{{ row.pickOrderId }}</span>
                    </template>
                    <template #content="{ }">
                        <div class="expand-wrapper">
                            <vxe-table border :data="expandData">
                                <vxe-column field="partNumber" title="Component Number"></vxe-column>
                                <vxe-column field="uniqueId" title="Picked UniqueId"></vxe-column>
                                <vxe-column field="requiredQuantity" title="Required Qty"></vxe-column>
                                <vxe-column field="pickStatus" title="Pick Status">
                                    <template #default="{ row }">
                                        <span v-if="row.pickStatus == 10">Open</span>
                                        <span v-else-if="row.pickStatus == 20">Processing</span>
                                        <span v-else-if="row.pickStatus == 30">Complete</span>
                                        <span v-else-if="row.pickStatus == 40">Transfer</span>
                                        <span v-else-if="row.pickStatus == 50">Received</span>
                                        <span v-else-if="row.pickStatus == -10">Closed</span>
                                        <span v-else-if="row.pickStatus == -20">Canceled</span>
                                    </template>
                                </vxe-column>
                                <vxe-column field="track" title="Track"></vxe-column>
                                <vxe-column field="smtMachine" title="Machine"></vxe-column>
                                <vxe-column field="smtSide" title="Side"></vxe-column>
                            </vxe-table>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column field="line" title="Line[线别]"></vxe-column>
                <vxe-column field="partNumber" title="Part Number[PCBA料号]"></vxe-column>
                <vxe-column field="workOrder" title="Work Order[工单]"></vxe-column>
                <vxe-column field="created" title="Created Time[创建时间]"></vxe-column>
                <vxe-column field="required" title="Required Time[需求时间]"></vxe-column>
                <vxe-column field="pickOrderType" title="Pick Order Type[订单类型]">
                    <template #default="{ row }">
                        <span v-if="row.pickOrderType == 4">Auto</span>
                        <span v-else-if="row.pickOrderType == 5">Manual</span>
                    </template>
                </vxe-column>
                <vxe-column field="pickStatus" title="Pick Order Type[订单类型]">
                    <template #default="{ row }">
                        <span v-if="row.pickStatus == 10">Open</span>
                        <span v-else-if="row.pickStatus == 20">Processing</span>
                        <span v-else-if="row.pickStatus == 30">Complete</span>
                        <span v-else-if="row.pickStatus == 50">Done</span>
                    </template>
                </vxe-column>
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
import { fetchHistoryList, expandRowList } from '@/api/MPSKanban';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    pickOrderNumber: null,
    pcbaPartNumber: null,
    createdTime: null,
    pickOrderType: null,
    pickOrderStatus: null,
    lineName: null,
};
export default {
    name: 'PickOrderHistory',
    data() {
        return {
            tableData: [],
            expandData: [],
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
                    value: "50"
                },
            ],
            alllistQuery: Object.assign({}, defaultListQuery),
            lineList: [],
            fromLaberWidth: '250px',
            total: 0,
            loading: false,
        }
    },
    created() {
        this.getLineList();
        this.getList()
        this.handleResetSearch();
    },
    methods: {
        handleSearchList() {
            this.alllistQuery.pageNum = 1;
            this.getList();
        },
        handleResetSearch() {
            this.alllistQuery = Object.assign({}, defaultListQuery);
        },
        toggleExpandMethod({ expanded, row }) {
            //console.log('行展开事件' + expanded,row)
            if (expanded) {
                expandRowList(row.pickOrderId).then(res => {
                    if (res.success) {
                        this.expandData = res.data;
                       
                    }
                    else {
                        this.$message.error(res.msg)
                      
                    }
                })
                
            }
            return true;
        },
        handleSizeChange(val) {
            this.alllistQuery.pageNum = 1;
            this.alllistQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.alllistQuery.pageNum = val;
            this.getList();
        },
        /**
         * 获取分页数据
         */
        getList() {
            this.loading = true;
            if (this.alllistQuery.pickOrderType == null) {
                this.alllistQuery.pickOrderType = 0;
            }
            if (this.alllistQuery.pickOrderStatus == null) {
                this.alllistQuery.pickOrderStatus = 0;
            }
            fetchHistoryList(this.alllistQuery).then(response => {
                if (response.success) {
                    this.tableData = response.data;
                    this.total = response.dynamicData.total;
                    this.loading = false;
                    if (this.alllistQuery.pickOrderType == 0) {
                        this.alllistQuery.pickOrderType = null;
                    }
                    if (this.alllistQuery.pickOrderStatus == 0) {
                        this.alllistQuery.pickOrderStatus = null;
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: response.msg
                    });
                    if (this.alllistQuery.pickOrderType == 0) {
                        this.alllistQuery.pickOrderType = null;
                    }
                    if (this.alllistQuery.pickOrderStatus == 0) {
                        this.alllistQuery.pickOrderStatus = null;
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