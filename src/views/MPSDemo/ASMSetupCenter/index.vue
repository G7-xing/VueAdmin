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
                        <el-select v-model="alllistQuery.listQuery.lineId" filterable default-first-option clearable
                            style="width: 13rem;" placeholder="请选择线别">
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Part Number[料号]:">
                        <el-input v-model="alllistQuery.listQuery.asmPartNumber" placeholder="请输入原材料料号"
                            style="width: 13rem;"></el-input>
                    </el-form-item>

                    <el-form-item label="Unique ID[CFM批次号]:">
                        <el-input v-model="alllistQuery.listQuery.asmUID" placeholder="请输入CFM批次号"
                            style="width: 13rem;"></el-input>
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
            <vxe-table resizable show-overflow ref="xTable" border :loading="loading" :data="tableData"
                :row-config="{ isCurrent: true, isHover: true }" height="550">
                <vxe-column v-for="config in tableColumn" :key="config.key" :type="config.type" :field="config.field"
                    :title="config.title" :fixed="config.fixed" :width="config.width" :align="config.align"
                    :filters="config.filters"></vxe-column>
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
    name: 'ASMSetupCenter',
    data() {
        return {
            tableColumn: [
                { key:0,   type:'seq',   field:  null,                   width:60,   align:'center',  fixed:null,   filters:null,   title: '序号',                         },
                { key:1,   type:null,    field: 'setup',                 width:220,  align:'center',  fixed:null,   filters:null,   title: 'SetupName[程序名称]',             },   
                { key:2,   type:null,    field: 'line',                  width:220,  align:'center',  fixed:null,   filters:null,   title: 'Line[线别]',                    },  
                { key:3,   type:null,    field: 'station',               width:220,  align:'center',  fixed:null,   filters:null,   title: 'Station[站点]',                 },     
                { key:4,   type:null,    field: 'trackName',             width:220,  align:'center',  fixed:null,   filters:null,   title: 'TrackName[上料点名称]',            },  
                { key:5,   type:null,    field: 'pU1_UniqueId',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_UniqueId[批次号]',           },    
                { key:6,   type:null,    field: 'pU1_PartNumber',        width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_PartNumber[料号]',          },     
                { key:7,   type:null,    field: 'pU1_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_OriginalQuantity[原始数量]',  },   
                { key:8,   type:null,    field: 'pU1_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_Quantity[剩余数量]',          },   
                { key:9,   type:null,    field: 'pU2_UniqueId',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_UniqueId[批次号]',           },    
                { key:10,  type:null,    field: 'pU2_PartNumber',        width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_PartNumber[料号]',          },     
                { key:11,  type:null,    field: 'pU2_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_OriginalQuantity[原始数量]',  },   
                { key:12,  type:null,    field: 'pU2_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_Quantity[剩余数量]',          },   
                { key:13,  type:null,    field: 'pU3_UniqueId',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_UniqueId[批次号]',           },    
                { key:14,  type:null,    field: 'pU3_PartNumber',        width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_PartNumber[料号]',          },     
                { key:15,  type:null,    field: 'pU3_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_OriginalQuantity[原始数量]',  },   
                { key:16,  type:null,    field: 'pU3_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_Quantity[剩余数量]',          },   
            ],
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
            pickupStatusOptions: [
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
<style lang="scss">
.expand-wrapper {
    padding: 20px;
}

.pagination-container {
    margin-top: 10px;
    padding-bottom: 30px;
}
</style>



