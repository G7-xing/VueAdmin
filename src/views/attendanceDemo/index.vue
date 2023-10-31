<template>
    <div >

        <!-- 搜索区域 -->
        <el-card class="filter-container" shadow="never">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="年/月：">
                    <el-date-picker v-model="currentDate" type="month" placeholder="选择月"></el-date-picker>
                </el-form-item>
                <el-form-item label="部门：">
                    <el-select v-model="departmentId" multiple collapse-tags placeholder="请选择部门" @change="handleChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="text-align: center; margin-left: 10px;">
                    <div class="tag-class">{{ this.year }}年{{ this.month }}月</div>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="fullscreen">
            <div >
                <!-- 展示框 -->
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="6">
                        <div style="text-align: center;">
                            <el-tag color="#de7465" class="tag">V--休假</el-tag>
                            <el-tag color="#c4d09d" class="tag">S--病假</el-tag>
                            <el-tag color="#ffe084" class="tag">H--半天假</el-tag>
                            <el-tag color="#cc99ff" class="tag">E--出差</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="title-p">员工考勤时间表</div>
                    </el-col>
                    <el-col :span="6">
                        <div style="text-align: right;">
                            <div v-if="fullscreenLoading"
                                style="font-size: 40px; display: inline; margin-left: 25px; color: #0f7987;">{{ this.year
                                }}年{{ this.month }}月</div>
                            <el-button v-if="fullscreenLoading === false" style="font-size: 10px; margin-bottom: 5px;"
                                @click="toggleFullscreen">
                                <i style="font-size: 2.1em; color: #0f7987;border-radius: 30px"
                                    class="vxe-icon-fullscreen"></i>
                            </el-button>
                            <el-button v-else-if="fullscreenLoading === true" style="font-size: 10px; margin-bottom: 5px;"
                                @click="toggleFullscreen">
                                <i style="font-size: 2.1em; color: #0f7987;" class="vxe-icon-minimize"></i>
                            </el-button>

                        </div>
                        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
                        <!-- <svg-icon  id="screenfull" :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" /> -->
                    </el-col>
                </el-row>
            </div>
                <!-- 表格 -->
                <el-table v-loading="listLoading" ref="listTable" border style="width: 100%;" :data="list" size="small"
                    height="650" row-key="userId" :header-cell-style="headerCellStyle" highlight-current-row
                    :show-header="true" :cell-style="cellStyle" @cell-click="cellHandleclick"
                    :cell-class-name="tableCellClassName" @cell-mouse-enter="stopScrollFn" @cell-mouse-leave="autoScrollFn">
                    <el-table-column label="Name" fixed prop="userName" width="185"></el-table-column>
                    <el-table-column v-for="(item, index) in monthDaysOfWeek" :key="index" :label=item.week width="50">
                        <el-table-column :label=item.day width="50" prop="datalist">
                            <template slot-scope="scope">
                                <div v-for="(val, index1) in scope.row.datalist" :key="index1">
                                    <div v-if="val.attendanceDate === item.fullDate && val.type !== 'N'">{{ val.type +
                                        '\n' }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="Total" fixed="right" prop="days" style="text-align: center;"></el-table-column>
                </el-table>
            
        </div>
        <!-- 对话框 -->
        <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="dataFrom" ref="dataFrom" label-width="150px" size="medium">
                <el-form-item label="姓名:" class="item-class">{{ dataFrom.userName }}</el-form-item>
                <el-form-item label="选中日期:" class="item-class"> {{ dataFrom.attendanceDate }}</el-form-item>
                <el-form-item label="缺勤类型:">
                    <el-radio-group v-model="dataFrom.attendanceType">
                        <el-radio-button :label="'V'">V--休假</el-radio-button>
                        <el-radio-button :label="'S'">S--病假</el-radio-button>
                        <el-radio-button :label="'H'">H--半天假</el-radio-button>
                        <el-radio-button :label="'E'">E--出差</el-radio-button>
                        <!-- <el-radio-button :label="'N'">N--正常</el-radio-button> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="isEdit" label="是否删除：">
                    <el-radio-group v-model="dataFrom.Status">
                        <el-radio border :label="1">是</el-radio>
                        <el-radio border :label="0">否</el-radio>
                    </el-radio-group>
                    <span v-if="isEdit" style="color: red;margin-left: 2px; font-size: medium;">*此功能是编辑与删除,请注意删除选项</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirm()" size="medium">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    createAttendance,
    deleteAttendance,
    updateAttendance,
    fetchList
} from '@/api/attendanceDemo';
import {
    changeFromat
} from '@/utils/index';
import {
    mapGetters
} from 'vuex';
import {
    getDepartDataList
} from '@/api/department';
import {
    treeDataTranslate, convertTree
} from '@/utils';
import Screenfull from 'screenfull'
const defaultDataFrom = {
    userName: null,
    attendanceDate: '',
    attendanceType: 'N',
    Status: 0,
};

export default {
    name: "attendance",
    data() {

        return {
            list: [],
            departmentData: [],
            departmentId: [],
            departmentName: '',
            currentDate: new Date(),
            monthDaysOfWeek: [],
            month: 0,
            year: '',
            daysInMonth: '',
            clickedRow: '', // 点击的单元格行号
            clickedColumn: '', // 点击的单元格列名
            dialogVisible: false,
            isEdit: false,
            dataFrom: Object.assign({}, defaultDataFrom),
            listLoading: false,
            departmentListTreeProps: {
                label: 'departmentName',
                children: 'children'
            },
            visible: false,
            scrolltimer: '',
            options: [],
            props: { multiple: true, checkStrictly: true },
            fullscreenLoading: false,
            isFullscreen: false,
            timer:"",//循环定时器
            va:0
        }
    },
    components: {
        Screenfull,
    },
    created() {
        this.getNowDate();
        this.getDepartDataList();
        this.getAttendanceList();
       
    },
    computed: {
        ...mapGetters(['userid']),
        changeData() { // 计算属性与监控一起作用 用于监控多个数据的变化对应的逻辑处理
            let {
                departmentId,
                currentDate
            } = this;
            return {
                departmentId,
                currentDate
            };
        },
    },

    watch: {
        changeData(newVal, oldVal) {
            //console.log(newVal, oldVal);
            //debugger
            if (newVal !== oldVal) {
                if (this.currentDate === null || this.departmentId === null) {
                    this.list = [];
                    return;
                }
                this.getNowDate();
                this.getAttendanceList();
                this.autoScrollFn()
            }
        },
        
    },
    mounted() {
        this.autoScrollFn();
        // // 监听全屏事件
        // document.addEventListener('fullscreenchange', this.fullscreenchange);
    },
    beforeDestroy() {  
        // // 移除监听全屏事件
        // document.removeEventListener('fullscreenchange', this.fullscreenchange);
        clearInterval(this.timer);// 移除该循环定时器
     },
    methods: {
        // handleFullscreenchange() {
        //     debugger
        //     if(document.fullscreenElement){
        //         this.isFullscreen = true;
        //         this.$nextTick(()=>{
        //             const el = this.$el.querySelector('.el-table-container');
        //             if (this.isFullscreen) {
        //                 el.style.height = `${document.documentElement.clientHeight}px`;
        //             }else{
        //                 el.style.height = "auto";
        //             }
        //         });
        //     }else{
        //         this.isFullscreen = false;
        //     }
        // },
        click() {
            //debugger
            const element = document.getElementById('fullscreen');
            if (Screenfull.isEnabled) {
                debugger
                Screenfull.request(element); // 元素全屏
            }
        },
        autoScrollFn() {
            if (this.fullscreenLoading) {
                clearInterval(this.scrollTimer);
                clearInterval(this.timer);
                this.$nextTick(() => {
                    const tBody = this.$refs.listTable.$refs.bodyWrapper;
                    // 当可视窗口高度大于表格高度时，不滚动
                    if (tBody.clientHeight > tBody.scrollHeight) {
                        return;
                    }
                    if (this.scrollInitFlag) {
                        tBody.scrollTop = 0;
                        this.scrollInitFlag = false;
                    }
                    this.timer = setInterval(this.getAttendanceList, 1000*60*60*5);//定时器 5个小时
                    this.scrollTimer = setInterval(() => {
                        tBody.scrollTop += 0.5; // 每次上滑一个像素
                        // 当滚动到最底部(可视高度+距离顶部=整个高度)时，从头开始滚
                        //console.log(tBody.clientHeight,tBody.scrollTop,tBody.scrollHeight);
                        if (tBody.clientHeight + tBody.scrollTop >= tBody.scrollHeight) {
                            tBody.scrollTop = 0;
                        }
                    }, (1000 / 60) * 3); // 1000 / 60
                });
            }
        },

        stopScrollFn() {
            clearInterval(this.scrollTimer);
            clearInterval(this.timer);// 移除该循环定时器
            this.scrollTimer = null;
        },
        handleChange(value) {
            this.departmentId = value;
        },
        // 获取表格数据
        getAttendanceList() {
            console.log(this.va+1);
            if (this.month === null || this.year === null || this.departmentId.length === 0) {
                this.list = [];
                this.$message({
                    message: "请选择日期和部门",
                    type: "error"
                })
            } else {
                //this.listLoading = true;
                //console.log("9090-----" + this.departmentId);
                let m = this.month < 10 ? ('0' + this.month) : this.month;
                let yearOfMonth = this.year + '-' + m;
                let params = {
                    yearOfMonth,
                    departmentId: this.departmentId
                }

                fetchList(params).then(res => {
                    if (res.success) {
                        //console.log(res.data);
                        if (res.data === null) {
                            this.list = [];
                        } else {
                            this.list = res.data;
                        }
                        this.list.forEach(item => {
                            if (item.userId === this.userid) {
                                item.sort = 1;
                            }
                            let usernameNew = '';
                            for (let index = 0; index < item.userName.length; index++) {
                                if (index == 0 || usernameNew[usernameNew.length - 1] === '.') {
                                    usernameNew += item.userName[index].toUpperCase();
                                } else {
                                    usernameNew += item.userName[index];
                                }
                            }
                            item.userName = usernameNew;
                        })
                        this.list.sort((x, y) => {
                            return y.sort - x.sort;
                        });
                        //console.log(this.list);
                    } else {
                        this.list = [];
                        this.listLoading = false
                        this.$message.error(res.msg);

                    }
                })
            }
        },
        // 获取部门的数据
        getDepartDataList() {
            getDepartDataList().then(res => {
                if (res.success) {
                    console.log(res.data);
                    let outPart = ["Veoneer-NPPI", "ME", "CI", "OPS"];
                    res.data.forEach(item => {
                        let value = item.departmentId;
                        let label = item.departmentName;
                        if (!outPart.includes(label)) {
                            this.options.push({ value, label });
                        }

                    })
                    // let map = {
                    //     value: "id",
                    //     label: "label",
                    //     // children: "children",
                    // };
                    // let tree = treeDataTranslate(res.data, 'departmentId');
                    // this.options = convertTree(res.data, map)

                    if (this.departmentId === "") { // 初始状态下不加载表格数据，当两个条件都选的情况下才可以加载数据
                        this.list = [];
                    }
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 菜单树选中
        departmentListTreeCurrentChangeHandle(data, node) {
            //debugger;
            this.departmentId = data.departmentId;
            this.departmentName = data.departmentName;
            this.visible = false;
        },
        toggleFullscreen() {
            const el = document.querySelector('.fullscreen'); // 获取需要全屏的元素
            if (!document.fullscreenElement) { 
                // 判断是否已经处于全屏模式
                el.requestFullscreen().catch(err => { // 进入全屏模式
                    console.log(`进入全屏模式失败：${err.message}`);
                });
                
                this.fullscreenLoading = true;
                this.$nextTick(()=>{
                    const ele = this.$refs.listTable.$el;
                   // console.log(this.$refs.listTable.$el,el);
                    if (this.fullscreenLoading) {
                        console.log(document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight,document.documentElement.offsetTop);
                        ele.style.height = `${document.documentElement.clientHeight+100}px`;
                    }else{
                        ele.style.height = "auto";
                    }
                });
               
            } else {
                document.exitFullscreen(); // 退出全屏模式
                this.fullscreenLoading = false;
                this.stopScrollFn();
                
            }
        },
        // 获取当前时间
        getNowDate() {
            //this.listLoading = true;
            // 获取月份
            let currentMonth = this.currentDate.getMonth();
            // 获取下一个月的第一天
            let nextMonthFirstDay = new Date(this.currentDate.getFullYear(), currentMonth + 1, 1);
            // 获取月份的最后一天
            let currentMonthLastDay = new Date(nextMonthFirstDay.getTime() - 1);
            // 获取月份的天数
            this.daysInMonth = currentMonthLastDay.getDate();
            //console.log("当前月份的天数：" + this.daysInMonth);
            // 获取月份 ，年份
            this.month = currentMonth + 1;
            this.year = this.currentDate.getFullYear();
            this.monthDaysOfWeek = changeFromat(this.year, this.month, this.daysInMonth);
            //console.log(this.monthDaysOfWeek);
            //console.log(this.year, this.month);

        },

        handleUpdate(index, row) {
            console.log('======' + index);
            console.log('======' + row);
        },

        tableCellClassName({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            // 注意这里是解构
            // 利用单元格的 className 的回调方法，给行列索引赋值
            row.index = rowIndex;
            column.index = columnIndex;
        },
        cellHandleclick(row, column, cell, event) {
            //.log("选中的cell坐标是" + row.index, column.index, row.userId, this.userid);
            if (row.userId !== this.userid) {
                const h = this.$createElement;
                this.$message({
                    message: h('p', {
                        style: 'width: 800px'
                    }, [h('span', {
                        style: 'font-size: 20px;color: red;'
                    }, '您只能添加或者修改自己考勤信息,无法修改他人的考勤信息')]),
                    type: 'warning',
                    duration: 2000,
                    offset: 200,
                });
                return;
            }
            // 判断是编辑还是新增
            cell.innerText !== "" ? this.isEdit = true : this.isEdit = false;
            // 打开对话框
            if (column.label !== 'Name' & column.label !== 'Total') {
                this.dialogVisible = true;
            }
            // 对话框的数据回显
            let m = this.month < 10 ? ('0' + this.month) : this.month;
            let d = column.label < 10 ? ('0' + column.label) : column.label;
            let columFullDate = this.year + '-' + m + '-' + d;
            this.dataFrom.userName = row.userName;
            this.dataFrom.attendanceDate = columFullDate;

            if (this.isEdit) {
                // 进行内容回显
                this.dataFrom.attendanceType = cell.innerText;
            } else { // 新增

            }
            this.clickedRow = row.index
            this.clickedColumn = column.index
        },
        handleDialogConfirm() {
            this.$confirm('是否要提交?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) { //编辑
                    if (this.dataFrom.Status === 1) { // 删除该条记录
                        deleteAttendance({ attendanceDate: this.dataFrom.attendanceDate, userId: this.userid }).then((res) => {
                            if (res.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.dialogVisible = false;
                                this.getAttendanceList();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.msg
                                });
                                this.dialogVisible = false;
                            }
                        })
                    } else { // 不是删除该条记录修改信息而已
                        let obj = {};
                        obj.AbsenceDate = this.dataFrom.attendanceDate;
                        obj.UserId = this.userid;
                        obj.AbsenceType = this.dataFrom.attendanceType;
                        obj.Status = this.dataFrom.Status;
                        //obj.CreateBy = this.userid;
                        obj.UpdateBy = this.userid;
                        updateAttendance(obj).then(res => {
                            if (res.success) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                                this.dialogVisible = false;
                                this.getAttendanceList();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.msg
                                });
                                this.dialogVisible = false;
                            }
                        })
                    }
                } else { //新增
                    //debugger
                    let obj = {};
                    obj.AbsenceDate = this.dataFrom.attendanceDate;
                    obj.UserId = this.userid;
                    obj.AbsenceType = this.dataFrom.attendanceType;
                    obj.Status = this.dataFrom.Status;
                    obj.CreateBy = this.userid;
                    obj.UpdateBy = this.userid;
                    createAttendance(obj).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getAttendanceList();
                    })
                }
            })
        },
        cellStyle({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            let cellStyle;
            //  先每一行循环然后列循环
            // 先排除第一列和最后一列

            if (column.label !== 'Name' & column.label !== 'Total') {
                let m = this.month < 10 ? ('0' + this.month) : this.month;
                let d = column.label < 10 ? ('0' + column.label) : column.label;
                let columFullDate = this.year + '-' + m + '-' + d;
                //console.log(columFullDate);
                // 对每一行数据进行遍历
                if (row.datalist) {
                    row.datalist.forEach(element => {
                        if (element.attendanceDate === columFullDate) {
                            switch (element.type) {
                                case "V":
                                    cellStyle = 'background: #de7465;color:white;textAlign: center;';
                                    break;
                                case "S":
                                    cellStyle = 'background: #c4d09d;color:white;textAlign: center;';
                                    break;
                                case "H":
                                    cellStyle = 'background: #ffe084;color:white;textAlign: center;';
                                    break;
                                case "E":
                                    cellStyle = 'background: #cc99ff;color:white;textAlign: center;';
                                    break;
                                default:
                                    cellStyle = 'textAlign: center';
                                    break;
                            }
                        }
                    });
                }
                return cellStyle;
            }
            return cellStyle = 'textAlign: center';

        },
        headerCellStyle({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            let cellStyle;
            // 先每一行循环然后列循环
            // 先排除第一列和最后一列
            // 对每一行数据进行遍历
            switch (column.label) {
                case "六":
                    cellStyle = 'background: #67c23a;color:white;textAlign: center;';
                    break;
                case "日":
                    cellStyle = 'background: #67c23a;color:white;textAlign: center;';
                    break;
                default:
                    cellStyle = 'textAlign: center';
                    break;
            }
            return cellStyle;
        }
    }

}
</script>

<style lang="scss" scoped>
.app-container {
    .operate-container {
        .edit {
            margin-right: 100px;
        }
    }
}



.fullscreen {
    width: 100% !important;
    height: 100% !important;
    display: inline-block;
    flex-direction: column;
    overflow: hidden;
}

.title-p {
    text-align: center;
    color: #0f7987;
    font-size: 40px;
    font-family: sans-serif;
    font-weight: 900;
    margin: 0px;

}

.tag-class {
    font-size: 80px;
    color: #0f7987;
    font-weight: 700;
    text-align: center;
    //background-color: cadetblue;
}

::v-deep .el-form-item__label {

    margin-top: 10px;
    margin-left: 10px;
    line-height: 30px;
    font-size: larger;
    color: #0f7987;
    font-weight: 700;
    text-align: center;
}

.item-class {
    display: inline-block;
    margin-top: 15px;
    margin-left: 10px;
}



::v-deep .el-input__icon {
    //日历图标
    line-height: 30px;
}

::v-deep .el-row--flex {
    align-content: center;
    background: #fff;
    align-items: baseline;
}

.tag {
    display: inline;
    font-size: larger;
    margin: 10px 10px 10px 0px;
}

::v-deep .el-table__header {
    font-size: 20px;
}

::v-deep .el-table thead {
    color: #0f7987;
}

::v-deep .el-table {
    font-size: 20px;
    color: #42b983;
    height: 100%;
}

::v-deep .el-form-item__content {
    font-size: 30px;
    color: red;
}

::v-deep .el-card__body {
    padding: 25px 0px 40px 0px;
    margin: 0px 0px -30px 0px;
}



// ::v-deep .el-table__empty-block {
//     display: none !important;
// }


// ::v-deep .el-table__body {
//     width: 100% !important;
// }

// ::v-deep .el-table th {
//     font-size: 1.2rem !important;
// }


// 修改奇数行颜色
::v-deep .el-table tr:nth-child(odd) {
    //background-color: transparent !important;
    color: #0f9c9c !important;
}

// 修改偶数行颜色
::v-deep .el-table tr:nth-child(even) {
    color: #000000 !important;
    //background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
