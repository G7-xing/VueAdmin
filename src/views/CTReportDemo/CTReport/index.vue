<template>
    <div class="app-container">
        <div class="table-container">
            <el-card class="filter-container" shadow="never">
                <div style="margin-top: -10px;">
                    <i class="el-icon-search"></i>
                    <span>{{ "\u3000" }}筛选搜索</span>
                </div>
                <div style="margin: 10px 10px -10px 1px;">
                    <el-form :inline="true" :model="alllistQuery" size="medium" class="demo-form-inline">
                        <el-form-item label="日 期：">
                            <el-date-picker v-model="alllistQuery.listQuery.when" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="料 号:">
                            <el-input v-model="alllistQuery.listQuery.shippingNo" placeholder="请输入料号"></el-input>
                        </el-form-item>
                        <el-form-item label="线 体:">
                            <el-select v-model="alllistQuery.listQuery.lineId" filterable default-first-option clearable
                                placeholder="请选择线体">
                                <el-option v-for="item in lineList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="handleSearchList()" round size="small">
                            <i class="el-icon-search"></i>查询搜索
                        </el-button>
                        <el-button type="info" @click="handleResetSearch()" round size="small">
                            <i class="el-icon-refresh-left"></i>重置
                        </el-button>
                    </el-form>
                </div>
            </el-card>

            <vxe-toolbar>
                <template #buttons>
                    <vxe-button icon="vxe-icon-square-plus" @click="insertEvent()">新增</vxe-button>
                </template>
            </vxe-toolbar>

            <vxe-table border resizable show-overflow ref="xTable" height="500" :row-config="{ isHover: true ,keyField:'ctReport.ctRepeortId'}"
                :data="tableData" :loading="loading" @cell-dblclick="cellDBLClickEvent" header-align="center"
                align="center">
                <vxe-column type="seq" width="60" fixed="left"></vxe-column>
                <vxe-column field="ctReport.shippingNo" title="料号" width="150"> </vxe-column>
                <vxe-column field="ctReport.customer" title="客户" width="150"></vxe-column>
                <vxe-column field="ctReport.platform" title="平台" width="150"></vxe-column>
                <vxe-column field="ctReport.project" title="项目" width="150"></vxe-column>
                <vxe-column field="lineName" title="线体" width="150"></vxe-column>
                <vxe-column field="ctReport.when" title="时间" width="150"></vxe-column>
                <vxe-column field="ctReport.resultCt" title="Cycle Time" width="150"></vxe-column>
                <vxe-column field="ctReport.resultNeckstation" title="瓶颈站位" width="150"></vxe-column>
                <vxe-column field="ctReport.taktTime" title="Target Time" width="150"></vxe-column>
                <vxe-column field="ctReport.resultBalancerateline" title="平衡率(line)%" :formatter="formatterNum"
                    width="150"></vxe-column>
                <vxe-column field="ctReport.resultBalancerateop" title="平衡率(OP)%" :formatter="formatterNum" width="150">
                </vxe-column>
                <vxe-column field="ctReport.connPlatesNum" title="连板数" width="150"></vxe-column>
                <vxe-column field="ctReport.opNum" title="线内人数" width="150"></vxe-column>
                <vxe-column field="ctReport.who" title="记录人" width="150"></vxe-column>
                <vxe-column field="ctReport.why" title="原因" width="150"></vxe-column>
                <vxe-column field="ctReport.how" title="方式" width="150"></vxe-column>
                <vxe-column field="ctReport.comments" title="备注" width="150"></vxe-column>
                <vxe-column title="操作" width="150" show-overflow fixed="right">
                    <template #default="{ row }">
                        <vxe-button type="text" icon="vxe-icon-edit" @click="editEvent(row)"></vxe-button>
                        <!-- <vxe-button type="text" icon="vxe-icon-delete" @click="removeEvent(row)"></vxe-button> -->
                        <vxe-button v-if="row.ctReport.haveDetail === 'no'" type="text" icon="vxe-icon-upload"
                            @click="uploadDetail(row)"></vxe-button>
                        <vxe-button v-else-if="row.ctReport.haveDetail === 'yes'" type="text" icon="vxe-icon-eye-fill"
                            @click="eyeDetail(row)"></vxe-button>
                    </template>
                </vxe-column>
            </vxe-table>

            <div class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="total, sizes,prev, pager, next,jumper" :current-page.sync="alllistQuery.pageNum"
                    :page-size="alllistQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
                </el-pagination>
            </div>


            <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="1350" min-width="900"
                min-height="300" :loading="submitLoading" resize destroy-on-close style="font-size: large;">
                <template #default>
                    <vxe-form :data="formData" title-align="right" title-width="100" @submit="submitEvent">
                        <!-- <vxe-form-item title="Basic information" title-align="left" :title-width="200" :span="24"
                            :title-prefix="{ icon: 'vxe-icon-comment' }"></vxe-form-item> -->
                        <vxe-form-item field="when" title="时间:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.when" type="date" placeholder="请选择日期" transfer></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="who" title="记录人:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.who" placeholder="请输入姓名"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="why" title="原因:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <el-select v-model="data.why" filterable allow-create default-first-option clearable
                                    placeholder="请选择why">
                                    <el-option v-for="item in whyList" :key="item.value" :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="how" title="方式:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <el-select v-model="data.how" filterable allow-create default-first-option clearable
                                    placeholder="请选择how">
                                    <el-option v-for="item in howList" :key="item.value" :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="shippingNo" title="料号:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.shippingNo" placeholder="请输入料号"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="customer" title="客户:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.customer" placeholder="请输入客户"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="project" title="项目:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.project" placeholder="请输入项目"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="platform" title="平台:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.platform" placeholder="请输入平台"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="line" title="线体:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <el-select v-model="data.lineId" filterable default-first-option clearable
                                    placeholder="请选择线体">
                                    <el-option v-for="item in lineList" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="connPlatesNum" title="连板数:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.connPlatesNum" type="number" placeholder="请输入连板数值"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="OPNum" title="线内人数:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.OPNum" type="number" placeholder="请输入线内人数"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="taktTime" title="Target Time:" :span="6" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-input v-model="data.taktTime" placeholder="请输入Target Time"></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="comments" title="备注:" :span="12" :item-render="{}">
                            <template #default="{ data }">
                                <vxe-textarea v-model="data.comments" placeholder="请输入备注"
                                    :autosize="{ minRows: 2, maxRows: 4 }"></vxe-textarea>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item align="center" title-align="left" :span="24">
                            <template #default>
                                <vxe-button type="submit" status="success">提交</vxe-button>
                                <vxe-button type="reset">重置</vxe-button>
                            </template>
                        </vxe-form-item>
                    </vxe-form>
                </template>
            </vxe-modal>
        </div>

        <div class="app-container">

            <vxe-modal ref="detailModal" v-model="detail" :resize="true" :fullscreen="true" @close="closeThing"
                :title="detailType ? '提交上传CT报表详细数据' : '查看CT详细数据'">

                <template #default>
                    <el-row :gutter="12" style="margin-bottom: 15px;">
                        <el-col :span="6">
                            <el-card shadow="always" class="card">
                                料号：{{ cardRow.ctReport.shippingNo }}
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="always" class="card">
                                客户：{{ cardRow.ctReport.customer }}
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="always" class="card">
                                项目：{{ cardRow.ctReport.project }}
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="always" class="card">
                                线体：{{ cardRow.lineName }}
                            </el-card>
                        </el-col>
                    </el-row>

                    <div>

                        <vxe-toolbar v-show="detailType" ref="toolbarRef" :loading="loading" custom>
                            <template #buttons>
                                <vxe-button status="primary" content="临时新增" icon="vxe-icon-add"
                                    @click="insertDetailEvent"></vxe-button>
                                <vxe-button status="warning" content="临时删除" icon="vxe-icon-delete"
                                    @click="removeSelectDetailEvent"></vxe-button>
                                <!-- <vxe-button status="danger" content="直接删除" icon="vxe-icon-delete-fill"
                                    @click="deleteSelectDetailEvent"></vxe-button> -->
                                <vxe-button status="success" content="提交（将临时操作数据永久保存）" icon="vxe-icon-save"
                                    @click="saveDetailEvent"></vxe-button>
                                <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"
                                    style="margin-left:40%;" />
                            </template>
                        </vxe-toolbar>
                        <vxe-table border resizable show-overflow keep-source ref="detailTable" height="700"
                            :loading="loading" :data="detailTableData"
                            :edit-config="{ trigger: 'dblclick', mode: 'cell', showUpdateStatus: true, showInsertStatus: true }">
                            <vxe-column type="checkbox" width="60"></vxe-column>
                            <vxe-column type="seq" width="60"></vxe-column>
                            <vxe-column field="stationL1" title="stationL1" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.stationL1" type="text"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="manormachineL2" title="manOrMachineL2" :edit-render="{}" width="160px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.manormachineL2" type="text"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="typeL3" title="typeL3" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.typeL3" type="text"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num1" title="num1" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num1" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num2" title="num2" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num2" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num3" title="num3" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num3" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num4" title="num4" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num4" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num5" title="num5" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num5" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num6" title="num6" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num6" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num7" title="num7" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num7" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num8" title="num8" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num8" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num9" title="num9" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num9" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num10" title="num10" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num10" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num11" title="num11" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num11" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num12" title="num12" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num12" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num13" title="num13" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num13" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num14" title="num14" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num14" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num15" title="num15" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num15" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num16" title="num16" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num16" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num17" title="num17" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num17" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num18" title="num18" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num18" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num19" title="num19" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num19" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="num20" title="num20" :edit-render="{}" width="110px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.num20" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>

                            <vxe-column field="averageValue" title="averageValue" :edit-render="{}"
                                :formatter="formatterNumFloat" width="130px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.averageValue" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="allowance" title="allowance(%)" :edit-render="{}" :formatter="formatterNum"
                                width="140px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.allowance" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="connectPlates" title="connectPlates" :edit-render="{}" width="130px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.connectPlates" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="manOrMachineNums" title="manOrMachineNums" :edit-render="{}" width="190px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.manOrMachineNums" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="standardCT" title="standardCT" :edit-render="{}"
                                :formatter="formatterNumFloat" width="130px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.standardCT" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="equipmentCT" title="equipmentCT" :edit-render="{}" width="130px"
                                :formatter="formatterNumFloat">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.equipmentCT" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="manCT" title="manCT" :edit-render="{}" width="130px"
                                :formatter="formatterNumFloat">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.manCT" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="apportionTime" title="apportionTime" :edit-render="{}" width="150px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.apportionTime" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="stationCT" title="stationCT" :edit-render="{}" :formatter="formatterNumFloat"
                                width="130px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.stationCT" type="float" :digits="2"></vxe-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="remak" title="remak" :edit-render="{}" width="200px">
                                <template #edit="{ row }">
                                    <vxe-input v-model="row.remak" type="text"></vxe-input>
                                </template>
                            </vxe-column>
                            <!-- <vxe-column title="操作" width="240">
                                <template #default="{ row }">
                                    <vxe-button status="warning" content="临时删除"
                                        @click="removeRowDetailEvent(row)"></vxe-button>
                                    <vxe-button status="danger" content="直接删除"
                                        @click="deleteRowDetailEvent(row)"></vxe-button>
                                </template>
                            </vxe-column> -->
                        </vxe-table>
                    </div>
                </template>
            </vxe-modal>
        </div>
    </div>
</template>
   
<script>
import VXETable from 'vxe-table'
import { fetchList, createCTReport, saveDetailData, eyeDetailData, updateCTReport, deleteCTReport } from '@/api/CTReport';
import { fetchAllList } from '@/api/line';
import { mapGetters } from 'vuex'
import UploadExcelComponent from './UploadExcel/index.vue'
const defaultDataFrom = {
    ctRepeortId:'',
    when: null,
    who: null,
    why: null,
    how: null,
    shippingNo: null,
    customer: null,
    project: null,
    lineId: null,
    connPlatesNum: 0,
    OPNum: 0,
    taktTime: null,
    comments: null,
    platform:null,
    haveDetail: 'no',
    updateBy: '',
    createby: ''
};
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    listQuery: {
        when: [], shippingNo: null, lineId: null
    }
};
const detailCTData = {
    userId: '',
    ctRepeortId: '',
    ctreportDetails: []
}
export default {
    data() {
        return {
            submitLoading: false,
            loading: false,
            tableData: [],
            selectRow: null,
            showEdit: false,
            whyList: [
                { label: 'R&R', value: '0' },
                { label: 'Yearly Review', value: '1' },
                { label: 'Random Review', value: '2' },
                { label: 'Improve', value: '3' },
                { label: 'Production Feedback', value: '4' }
            ],
            howList: [
                { label: 'Video analysis', value: '00' },
                { label: 'Stopwatch', value: '11' },
                { label: 'Estimate', value: '22' },
            ],
            lineList: [],
            formData: Object.assign({}, defaultDataFrom),
            total: null,
            alllistQuery: Object.assign({}, defaultListQuery),
            detail: false,
            detailTableData: [],
            detailHeader: [],
            cardRow: {},
            detailType: false,
        }
    },
    computed: {
        ...mapGetters(['userid'])
    },
    components: { UploadExcelComponent },
    created() {
        this.getLineList();
        this.fetchList();
        this.$nextTick(() => {
            // 将表格和工具栏进行关联
            const $table = this.$refs.detailTable
            const $toolbar = this.$refs.toolbarRef
            if ($table && $toolbar) {
                $table.connect($toolbar)
            }
        });
    },
    methods: {
        // 上穿界面的detail表格数据清空
        closeThing() {
            this.detailTableData = [];
            this.detailType = false;
        },
        //#region 处理Detail 方法
        formatterNum({ cellValue }) {
            if (cellValue) {
                //console.log(Number(cellValue).toFixed(2) ,cellValue);
                return Number(cellValue).toFixed(2)  + "%";
            }
        },
        formatterNumFloat({ cellValue }) {
            if (cellValue) {
                return Math.floor(cellValue * 100) / 100;
            }

        },
        async insertDetailEvent() {
            const $table = this.$refs.detailTable
            const newRecord = {}
            const { row: newRow } = await $table.insert(newRecord)
            await $table.setActiveRow(newRow)
        },
        async removeSelectDetailEvent() {
            const $table = this.$refs.detailTable
            //console.log(this.detailTableData, $table.getTableData().tableData);
            await $table.removeCheckboxRow();
            this.detailTableData = $table.getTableData().tableData;
            //console.log("后", this.detailTableData, $table.getTableData().tableData);
        },
        // async deleteSelectDetailEvent() {
        //     const type = await VXETable.modal.confirm('您确定要删除选中的数据?')
        //     if (type !== 'confirm') {
        //         return
        //     }
        //     const $table = this.$refs.detailTable
        //     const checkboxRecords = $table.getCheckboxRecords()
        //     this.loading = true
        //     try {
        //         const body = { removeRecords: checkboxRecords }
        //         await fetch(`${this.serveApiUrl}/api/pub/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        //         await this.loadList()
        //     } catch (e) { }
        //     this.loading = false
        // },
        // async removeRowDetailEvent(row) {
        //     debugger
        //     const $table = this.$refs.detailTable
        //     await $table.remove(row)
        //     //this.data.detail.splice(row.index, 1)
        // },
        // async deleteRowDetailEvent(row) {
        //     const type = await VXETable.modal.confirm('您确定要删除该数据?')
        //     if (type !== 'confirm') {
        //         return
        //     }
        //     this.loading = true
        //     try {
        //         const body = { removeRecords: [row] }
        //         await fetch(`${this.serveApiUrl}/api/pub/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        //         await this.loadList()
        //     } catch (e) { }
        // },
        async saveDetailEvent() {
            //debugger
            const $table = this.$refs.detailTable
            console.log(this.detailTableData, $table.getTableData());
            const { insertRecords, removeRecords, updateRecords } = $table.getRecordset()
            if (insertRecords.length <= 0 && removeRecords.length <= 0 && updateRecords.length <= 0 && this.detailTableData.length <= 0) {
                VXETable.modal.message({ content: '请上传数或者手动添加数据！', status: 'warning' })
                return
            }
            const errMap = await $table.validate().catch(errMap => errMap)
            if (errMap) {
                return
            }
            this.loading = true
            try {
                //const body = { insertRecords, removeRecords, updateRecords }
                detailCTData.ctreportDetails = this.detailTableData;
                detailCTData.userId = this.userid;
                detailCTData.ctRepeortId = this.cardRow.ctReport.ctRepeortId;
                await saveDetailData(detailCTData).then(res => {
                    if (res.success) {
                        VXETable.modal.message({ content: `操作成功，新增 ${insertRecords.length} 条，更新 ${updateRecords.length} 条，删除 ${removeRecords.length} 条`, status: 'success' })
                        console.log("ererere", this.$refs.detailModal);
                        this.$refs.detailModal.close();
                        this.closeThing();
                        this.fetchList();
                    } else {
                        VXETable.modal.message({ content: res.msg, status: 'error' })
                    }
                });

            } catch (e) {
                if (e && e.message) {
                    VXETable.modal.message({ content: e.message, status: 'error' })
                }
            }
            this.loading = false
        },
        //#endregion
        //#region 处理ecxel 方法 
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1

            if (isLt1M) {
                return true
            }

            this.$message({
                message: 'Please do not upload files larger than 1m in size.',
                type: 'warning'
            })
            return false
        },
        handleSuccess({ results, header }) {
            this.detailTableData = results
            this.detailHeader = header
        },
        //#endregion
        eyeDetail(row) {
            this.detailType = false;
            this.detail = true;
            this.cardRow = row;

            // 获取该CTReport的详细记录
            eyeDetailData(row.ctReport.ctRepeortId).then(res => {
                if (res.success) {
                    this.detailTableData = res.data;
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                    this.$refs.detailModal.close();
                    this.closeThing();
                    this.fetchList();
                }
            })
        },
        uploadDetail(row) {
            console.log(row);
            this.detail = true;
            this.detailType = true;
            this.cardRow = row;
        },
        getLineList() {
            fetchAllList().then(res => {
                if (res.success) {
                    res.data.forEach(element => {
                        let value = element.lineId;
                        let label = element.lineName;
                        this.lineList.push({ value, label });
                    });
                }
            })
        },
        handleResetSearch() {
            this.alllistQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.alllistQuery.pageNum = 1;
            this.fetchList();
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
        cellDBLClickEvent({ row }) {
            this.editEvent(row)
        },
        insertEvent() {
            this.formData = Object.assign({}, defaultDataFrom);
            this.selectRow = null
            this.showEdit = true
        },
        editEvent(row) {
            //debugger
            this.formData = {
                ctRepeortId: row.ctReport.ctRepeortId,
                when: row.ctReport.when,
                who: row.ctReport.who,
                why: row.ctReport.why,
                how: row.ctReport.how,
                shippingNo: row.ctReport.shippingNo,
                customer: row.ctReport.customer,
                project: row.ctReport.project,
                lineId: row.ctReport.lineId,
                connPlatesNum: row.ctReport.connPlatesNum,
                OPNum: row.ctReport.opNum,
                taktTime: row.ctReport.taktTime,
                comments: row.ctReport.comments,
                platform: row.ctReport.platform,
            }
            this.selectRow = row
            this.showEdit = true
        },
        async removeEvent(row) {
            const type = await VXETable.modal.confirm('您确定要删除该数据?')
            const $table = this.$refs.xTable
            if (type === 'confirm') {
                $table.remove(row)
            }
        },
        submitEvent() {
            this.submitLoading = true
            setTimeout(() => {
                const $table = this.$refs.xTable
                this.submitLoading = false
                this.showEdit = false
                if (this.selectRow) {
                    //debugger//$table.insert(this.formData)
                    //this.formData.createby = this.userid
                    this.formData.updateBy = this.userid
                    updateCTReport(this.formData).then(res => {
                        if (res.success) {
                            VXETable.modal.message({ content: '修改成功', status: 'success' })
                            this.fetchList();
                        } else {
                            VXETable.modal.message({ content: '修改失败'+res.msg, status: 'error' })
                            this.fetchList();
                        }
                    });
                    // VXETable.modal.message({ content: '保存成功', status: 'success' })
                    // Object.assign(this.selectRow, this.formData)
                } else {

                    //debugger//$table.insert(this.formData)
                    this.formData.createby = this.userid
                    this.formData.updateBy = this.userid
                    createCTReport(this.formData).then(res => {
                        if (res.success) {
                            VXETable.modal.message({ content: '新增成功', status: 'success' })

                            this.fetchList();
                        } else {
                            VXETable.modal.message({ content: '新增失败', status: 'error' })
                            this.fetchList();
                        }
                    });
                }
            }, 500)
        },
        fetchList() {
            this.loading = true;
            console.log(this.alllistQuery);
            fetchList(this.alllistQuery).then(response => {
                if (response.success) {
                    this.loading = false;
                    //debugger
                    this.tableData = response.data;
                    console.log(this.tableData);
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
.vxe-form--item-title-label {
    font-weight: 800;
}

.card {
    text-align: center;
    font-size: large;
    font-weight: 800;
}
.pagination-container{
    margin-top: 10px;
    padding-bottom: 30px;
}
</style>
  