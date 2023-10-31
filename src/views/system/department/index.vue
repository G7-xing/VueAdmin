<template>
    <div class="mod-menu">
        <div></div>
        <el-form :inline="true" :model="dataForm">
            <el-form-item style="float:right;margin-right: 20px;margin-top: 20px;margin-bottom: 10px;" >
                <el-button type="primary" @click="addOrUpdateHandle(0)">新增部门</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="dataList" row-key="departmentId" border style="width: 100%; ">
            <el-table-column prop="departmentName" header-align="center" style="width: 100%; " label="部门名称">
            </el-table-column>
            <!-- <el-table-column prop="status" label="是否启用" style="width: 100%;" align="center">
                <template slot-scope="scope">
                    <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
                        v-model="scope.row.status">
                    </el-switch>
                </template>
            </el-table-column> -->
            <el-table-column fixed="right" header-align="center" align="center" style="width: 100%; " label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.departmentId)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" ref="dataForm">
                <el-form-item label="部门名称" prop="parentName">
                    <el-input v-model="dataForm.departmentName" placeholder="部门名称" />
                </el-form-item>
                <el-form-item label="上级部门" prop="parentName">
                    <el-popover ref="departmentListPopover" placement="bottom-start" trigger="click">
                        <el-tree :data="dataList" :props="departmentListTreeProps" node-key="departmentId"
                            ref="departmentListTree" @current-change="departmentListTreeCurrentChangeHandle"
                            :default-expand-all="true" :highlight-current="true" :expand-on-click-node="true">
                        </el-tree>
                    </el-popover>
                    <el-input v-model="dataForm.parentName" v-popover:departmentListPopover :readonly="true"
                        placeholder="点击选择上级部门" class="department-list__input"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="dataForm.status" active-color="#13ce66" inactive-color="#ff4949" >
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
//import AddOrUpdate from './department-add-or-update.vue'
import { treeDataTranslate } from '@/utils';
import { getDepartDataList, addDepartment, deleteDepartment, getDepartmentInfo } from '@/api/department';
import { mapGetters } from 'vuex';
export default {
    name: 'Department',
    data() {
        return {
            dataForm: {},
            dataList: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
            visible: false,
            value: true,
            dataForm: {
                id: 0,
                parentId: 0,
                parentName: '',
                departmentId: '',
                departmentName: '',
                departmentLevel: 0,
                status: true
            },
            // dataRule: {
            //     name: [
            //         { required: true, message: '部门名称不能为空', trigger: 'blur' }
            //     ],
            //     parentName: [
            //         { required: true, message: '上级部门不能为空', trigger: 'change' }
            //     ],
            // },
            departmentList: [],
            departmentListTreeProps: {
                label: 'departmentName',
                children: 'children'
            }
        }
    },
    computed: {
        ...mapGetters(['userid'])
    },
    created() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            getDepartDataList().then(res => {
                if (res.success) {
                    this.dataList = treeDataTranslate(res.data, 'departmentId');
                    this.dataListLoading = true;
                } else {
                    this.$message.error(res.msg)
                }

            })
        },
        // 处理状态变化
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
                this.getList();
            });
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            //debugger;
            this.addOrUpdateVisible = true;
            this.dataForm.id = id ? 1 : 0;
            this.visible = true;
            // this.$nextTick 将回调延迟到下次DOM更新循环之后执行。因为dom元素没有渲染完成就执行了方法，导致找不到报错；执行此方法即解决这个问题；
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
            })
            if (!this.dataForm.id) {
                // 新增
            } else {
                // 修改
                getDepartmentInfo(id).then(res => {
                    //console.log(res);
                    if (res.success) {
                        this.dataForm.departmentId = res.data.departmentId;
                        this.dataForm.departmentName = res.data.departmentName;
                        this.dataForm.parentId = res.data.parentId;
                        this.dataForm.parentName = res.data.parentName;
                        this.dataForm.departmentLevel = res.data.departmentLevel;
                        this.dataForm.status = res.data.status == 1 ? true : false;     
    
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }

        },
        // 菜单树选中
        departmentListTreeCurrentChangeHandle(data, node) {

            this.dataForm.parentId = data.departmentId;
            this.dataForm.parentName = data.departmentName;
            this.dataForm.departmentLevel = data.departmentLevel;

        },
        // 菜单树设置当前选中节点
        departmentListTreeSetCurrentNode() {
            this.$refs.departmentListTree.setCurrentKey(this.dataForm.parentId);
            this.dataForm.parentName = (this.$refs.departmentListTree.getCurrentNode() || {})['departmentName'];
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let obj = {};
                    obj.createBy = this.userid;
                    obj.departmentName = this.dataForm.departmentName;
                    obj.parentName = this.dataForm.parentName;
                    obj.parentId = this.dataForm.parentId;
                    obj.departmentLevel = !this.dataForm.id ? this.dataForm.departmentLevel + 1 : this.dataForm.departmentLevel;
                    obj.status = this.dataForm.status?1:0;
                    obj.departmentId = !this.dataForm.id ? null :this.dataForm.departmentId;
                    addDepartment(obj, this.dataForm.id).then(res => {
                        if (res.success) {
                            this.$message({
                                message: !this.dataForm.id?'新增成功':'更新成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.getDataList();
                                    this.dataForm.departmentName = '';
                                    this.dataForm.parentName = '';
                                    this.dataForm.parentId = '';

                                }
                            })
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            })
        },

        // 删除
        deleteHandle(row) {
            //console.log(row);
            this.$confirm(`确定对[部门名称=${row.departmentName}]进行[删除]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteDepartment(row.departmentId).then(res => {
                    if (res.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }).catch(() => { })
        }
    }
}
</script>
  