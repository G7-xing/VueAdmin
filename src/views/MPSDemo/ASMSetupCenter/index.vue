<template>
    <div class="app-container">
        <el-card  shadow="never">
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
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="'Factory\\'+item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Part Number[料号]:">
                        <el-input v-model="alllistQuery.asmPartNumber" placeholder="请输入原材料料号"
                            style="width: 200px;"></el-input>
                    </el-form-item>

                    <el-form-item label="Unique ID[CFM批次号]:">
                        <el-input v-model="alllistQuery.asmUID" placeholder="请输入CFM批次号"
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
import { fetchASMSetupList } from '@/api/MPSKanban';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    lineName:null,
    asmPartNumber:null,
    asmUID:null
};
export default {
    name: 'ASMSetupCenter',
    data() {
        return {
            tableColumn: [
                { key:0,   type:'seq',   field:  null,                   width:60,   align:'center',  fixed:null,   filters:null,   title: '序号',                         },
                { key:1,   type:null,    field: 'setup',                 width:420,  align:'center',  fixed:null,   filters:null,   title: 'SetupName[程序名称]',             },   
                { key:2,   type:null,    field: 'line',                  width:220,  align:'center',  fixed:null,   filters:null,   title: 'Line[线别]',                    },  
                { key:3,   type:null,    field: 'station',               width:220,  align:'center',  fixed:null,   filters:null,   title: 'Station[站点]',                 },     
                { key:4,   type:null,    field: 'trackName',             width:320,  align:'center',  fixed:null,   filters:null,   title: 'TrackName[上料点名称]',            },  
                { key:5,   type:null,    field: 'pU1_PackagingUnitId',   width:270,  align:'center',  fixed:null,   filters:null,   title: 'PU1_UniqueId[批次号]',           },    
                { key:6,   type:null,    field: 'pU1_SiplaceProComponent', width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_PartNumber[料号]',          },     
                { key:7,   type:null,    field: 'pU1_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_OriginalQuantity[原始数量]',  },   
                { key:8,   type:null,    field: 'pU1_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU1_Quantity[剩余数量]',          },   
                { key:9,   type:null,    field: 'pU2_PackagingUnitId',   width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_UniqueId[批次号]',           },    
                { key:10,  type:null,    field: 'pU2_SiplaceProComponent',width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_PartNumber[料号]',          },     
                { key:11,  type:null,    field: 'pU2_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_OriginalQuantity[原始数量]',  },   
                { key:12,  type:null,    field: 'pU2_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU2_Quantity[剩余数量]',          },   
                { key:13,  type:null,    field: 'pU3_PackagingUnitId',   width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_UniqueId[批次号]',           },    
                { key:14,  type:null,    field: 'pU3_SiplaceProComponent',width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_PartNumber[料号]',          },     
                { key:15,  type:null,    field: 'pU3_OriginalQuantity',  width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_OriginalQuantity[原始数量]',  },   
                { key:16,  type:null,    field: 'pU3_Quantity',          width:220,  align:'center',  fixed:null,   filters:null,   title: 'PU3_Quantity[剩余数量]',          },   
            ],
            tableData: [
                
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
            
            alllistQuery: Object.assign({}, defaultListQuery),
            lineList: [],
            fromLaberWidth: '250px',
            total: 0,
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
            this.alllistQuery.listQuery = Object.assign({}, defaultListQuery);
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
            debugger
            if (this.alllistQuery.lineName!==null && this.alllistQuery.lineName.substring(11,12)==="0") {
                
                this.alllistQuery.lineName = this.alllistQuery.lineName.substring(0,11)+this.alllistQuery.lineName.substring(12,13);
            }
            
            fetchASMSetupList(this.alllistQuery).then(response => {
                if (response.success) {
                    this.tableData = response.data;
                    this.total = response.dynamicData.total;
                    this.loading = false;
                } else {
                    this.$message({
                        type: 'warning',
                        message: response.msg
                    });
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



