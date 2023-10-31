<template>
    <div class="mod-menu">
        <div></div>
        <el-form :inline="true" :model="dataForm">
            <el-form-item style="float:right;margin-right: 20px;margin-top: 20px;margin-bottom: 10px;">
                <el-button type="primary" @click="addOrUpdateHandle(0)">新增菜单</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="dataList" row-key="id" border style="width: 100%;" size="mini">
            <el-table-column prop="menuName" header-align="center" align="center"
                label="菜单名称"></el-table-column>
            <el-table-column prop="parentName" header-align="center" align="center"
                label="上级菜单"></el-table-column>
            <el-table-column prop="menuURL" header-align="center" align="center"  :show-overflow-tooltip="true"
                label="菜单URL"></el-table-column>
            <el-table-column prop="name" header-align="center" align="center"  :show-overflow-tooltip="true"
                label="前端菜单路由名称"></el-table-column>
            <el-table-column prop="sort" header-align="center" align="center" label="排序号"></el-table-column>
            <el-table-column fixed="right" header-align="center" align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small"
                        @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small"
                        @click="deleteHandle(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="!dataForm.type ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="180px" ref="dataForm">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="dataForm.menuName" placeholder="菜单名称" />
                </el-form-item>
                <el-form-item label="菜单URL" prop="menuURL">
                    <el-input v-model="dataForm.menuURL" placeholder="菜单路由--例如'/system/menu'"></el-input>
                </el-form-item>
                <el-form-item label="前端菜单路由名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="前端菜单路由名称--必须与router中的name保持一致,一般小写"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentName">
                    <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                        <el-tree :data="dataListTree" :props="menuListTreeProps" node-key="menuId" ref="menuListTree"
                            @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true"
                            :highlight-current="true" :expand-on-click-node="true">
                        </el-tree>
                    </el-popover>
                    <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true"
                        placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="dataForm.status" active-color="#13ce66" inactive-color="#ff4949">
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
import { treeDataTranslate } from '@/utils';
import { getMenuList, addMenu, deleteMenu, getMenuInfo } from '@/api/menu';
import { mapGetters } from 'vuex';
export default {
    name: 'Menu',
    data() {
        return {
            dataForm: {},
            dataList: [],
            dataListTree: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
            visible: false,
            value: true,
            dataForm: {
                type: 0,
                parentId: 0,
                parentName: '',
                id: '',
                menuURL: '',
                menuName: '',
                menuLevel: 0,
                status: true,
                name: ''
            },
            menuList: [],
            menuListTreeProps: {
                label: 'menuName',
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
            getMenuList().then(res => {
                if (res.success) {
                    this.dataList = treeDataTranslate(res.data, 'id');
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
            this.dataForm.type = id ? 1 : 0;
            this.visible = true;
            // 这里传值为了确保能获取到最终的一级菜单，传值任意字符串就行
            getMenuList("UpOrAdd").then(res => {
                if (res.success) {
                    this.dataListTree = treeDataTranslate(res.data, 'id');
                } else {
                    this.$message.error(res.msg)
                }

            })
            // this.$nextTick 将回调延迟到下次DOM更新循环之后执行。因为dom元素没有渲染完成就执行了方法，导致找不到报错；执行此方法即解决这个问题；
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
            })

            if (!this.dataForm.type) {
                // 新增

            } else {
                // 修改
                getMenuInfo(id).then(res => {

                    //console.log(res);
                    if (res.success) {
                        this.dataForm.id = res.data.id;
                        this.dataForm.menuName = res.data.menuName;
                        this.dataForm.menuURL = res.data.menuURL;
                        this.dataForm.parentId = res.data.parentId;
                        this.dataForm.parentName = res.data.parentName;
                        this.dataForm.menuLevel = res.data.menuLevel;
                        this.dataForm.name = res.data.name;
                        this.dataForm.status = res.data.status == 1 ? true : false;
                            
                    } else {
                        //this.dataForm = {};
                        this.$message.error(res.msg)
                    }
                })
            }

        },
        // 菜单树选中
        menuListTreeCurrentChangeHandle(data, node) {
            //debugger;
            this.dataForm.parentId = data.id;
            this.dataForm.parentName = data.menuName;
            this.dataForm.menuLevel = data.menuLevel;

        },
        // 菜单树设置当前选中节点
        menuListTreeSetCurrentNode() {
            this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
            this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['menuName'];
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let obj = {};
                    obj.createBy = this.userid;
                    obj.menuName = this.dataForm.menuName;
                    obj.menuURL = this.dataForm.menuURL;
                    obj.parentName = this.dataForm.parentName;
                    obj.parentId = this.dataForm.parentId;
                    obj.menuLevel = !this.dataForm.type ? this.dataForm.menuLevel + 1 : this.dataForm.menuLevel;
                    obj.status = this.dataForm.status ? 1 : 0;
                    obj.id = !this.dataForm.type ? null : this.dataForm.id;
                    obj.name = this.dataForm.name;
                    addMenu(obj, this.dataForm.type).then(res => {
                        if (res.success) {
                            this.$message({
                                message: !this.dataForm.type ? '新增成功' : '更新成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.getDataList();
                                    this.dataForm.menuName = '';
                                    this.dataForm.parentName = '';
                                    this.dataForm.parentId = '';
                                    this.dataForm.menuURL = '';
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
            this.$confirm(`确定对[菜单名称=${row.menuName}]进行[删除]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteMenu(row.id).then(res => {
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
  