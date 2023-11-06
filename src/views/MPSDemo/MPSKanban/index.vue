<template>
    <div class="brand-container">
        <div class="wrap">
            <header>
                <div class="weather">
                    <span>
                        <el-tag type="info" effeck="dark" style="background-color: #0a2f2f; color: #78e6e6;">Time&lt;10
                            mins</el-tag>
                        <el-tag type="info" effeck="warning"
                            style="background-color: rgb(252, 235, 3); color: #00f8f8;margin-left: 10px;">10=&lt;Time&lt;=20
                            mins</el-tag>
                        <el-tag type="info" effeck="danger"
                            style="background-color:rgb(248, 1, 1); color: #78e6e6;margin-left: 10px;">Time&gt;20
                            mins</el-tag>
                    </span>
                </div>
                <div class="title">
                    <span class="h2">
                        <span>Material Pull System Dashboard</span>
                        <span>物料拉动系统看板</span>
                    </span>
                </div>
                <div class="showTime">
                    <span class="time" @click="toggleFullscreen">{{ nowTime }}</span>
                    <span class="date">
                        <span>{{ week }}</span>
                        <span>{{ date }}</span>
                    </span>
                </div>
            </header>
            <div class="mainbox">
                <div class="item">
                    <div class="panel">
                        <el-table :data="tableData" :row-style="rowStyle"
                            :cell-style="{ 'text-align': 'center', 'font-size': '24px' }"
                            :header-cell-style="{ 'background': '#12212a', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">
                            <el-table-column label="seq" type="index" width="80" align="center"></el-table-column>
                            <el-table-column prop="pickOrderId" width="300" label="Pick Order[物料需求订单]" />
                            <el-table-column prop="line" label="Line[线别]" />
                            <el-table-column prop="partNumber" label="Part Number[产品号码]" />
                            <el-table-column prop="workOrder" label="Work Order[工单]" />
                            <el-table-column prop="created" label="Created Time[订单创建时间]" width="220">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.created.substring(11, scope.row.created.length) }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="required" label="Required Time[最迟配料时间]" width="220">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.required.substring(11, scope.row.created.length) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="pickOrderType" label="Pick Order Type[订单类型]" width="220">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.pickOrderType == '4'">Auto自动产生</span>
                                    <span v-else-if="scope.row.pickOrderType == '5'">Manual人工呼叫</span>
                                    <span v-else>Not Defined</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="pickStatus" label="Pick Order Status[订单状态]" width="220">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.pickStatus == '10'">Opened</span>
                                    <span v-else-if="scope.row.pickStatus == '20'">Processing</span>
                                    <span v-else-if="scope.row.pickStatus == '30'">Completed</span>
                                    <span v-else-if="scope.row.pickStatus == '40'">Transfer</span>
                                    <span v-else-if="scope.row.pickStatus == '50'">Received</span>
                                    <span v-else-if="scope.row.pickStatus == '-10'">Closed</span>
                                    <span v-else-if="scope.row.pickStatus == '-20'">Cancelled</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="panel-footer"></div>
                    </div>
                </div>
            </div>


        </div>

    </div>
</template>
  
<script>
import '@/assets/js/flexible';
import { getDeatils } from '@/api/MPSKanban';


export default {
    name: 'MPSKanban',

    data() {
        return {
            nowTime: '',
            week: '',
            date: '',
            timer: null,
            tableData: []

        }
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.getDeatilsInterval();
        this.timer = setInterval(() => {
            this.getDeatilsInterval();
        }, 1000 * 20)

        this.nowTimes();

    },
    methods: {
        getDeatilsInterval() {
            getDeatils().then(res => {
                if (res.success) {
                    this.tableData = res.data;

                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg
                    });
                }
            })
        },
        toggleFullscreen() {
            const el = document.querySelector('.brand-container'); // 获取需要全屏的元素
            if (!document.fullscreenElement) {
                // 判断是否已经处于全屏模式
                el.requestFullscreen().catch(err => { // 进入全屏模式
                    console.log(`进入全屏模式失败：${err.message}`);
                });
            } else {
                document.exitFullscreen(); // 退出全屏模式  
            }
        },
        rowStyle({ rowindex, row }) {
            var stylecss = {};
            if (row.pickStatus == 30) {
                stylecss = { 'background': '#7FFF00', 'color': '#7ef0ff' };
            } else if (row.pickStatus == 20) {
                stylecss = { 'background': '#00FFFF', 'color': '#7ef0ff' };
            } else if (row.pickStatus == 10) {
                if (row.expiredMinutes > 20) {
                    stylecss = { 'background-color': 'rgb(248, 1, 1)', 'color': '#7ef0ff' };
                } else if (row.expiredMinutes <= 20 && row.expiredMinutes >= 10) {
                    stylecss = { 'background-color': 'rgb(252, 235, 3)' };
                } else
                    stylecss = { 'background-color': '#0a2f2f', 'color': '#7ef0ff' };
            }
            return stylecss;
        },
        timeFormate(timeStamp) { //显示当前时间
            let newDate = new Date(timeStamp);
            let year = newDate.getFullYear();
            let month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
            let date = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
            let hh = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
            let mm = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
            let ss = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
            let week = newDate.getDay();
            let weeks = ['日', '一', '二', '三', '四', '五', '六'];
            let getWeek = '星期' + weeks[week];
            this.week = getWeek;
            this.date = year + '.' + month + '.' + date;
            this.nowTime = hh + ':' + mm + ':' + ss;
        },
        nowTimes() {
            this.timeFormate(new Date());
            setInterval(this.nowTimes, 1000);
            this.clear();
        },
        clear() {
            clearInterval(this.nowTimes)
            this.nowTimes = null;
        },

    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
}
</script>
  
<style lang="scss" >
.evenRow {
    background: #0c385e4b !important;
}

.oddRow {
    background: #305760 !important;
}

.brand-container {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #000;


    .wrap {
        background: url(../../../assets/img/brand/io.jpeg) no-repeat #000;
        background-size: cover;
        line-height: 1.15;

        header {
            position: relative;
            height: 1rem;
            background: url(../../../assets/img/brand/head_bg.png) no-repeat top center;
            background-size: 100% 100%;

            h2 {
                color: #7ef0ff;
                font-size: 0.475rem;
                text-align: center;
                line-height: 0.75rem;
                letter-spacing: 1px;
            }

            .title {
                position: absolute;
                left: 50%;
                top: 40%;
                transform: translate(-50%, -50%);
                font-size: 0.325rem;
                font-weight: 600;
                //color: #fff;

                .h2 {
                    color: #7ef0ff;
                    font-size: 0.475rem;
                    text-align: center;
                    //line-height: 0.75rem;
                    letter-spacing: 2px;

                    span {
                        display: block;

                        &:nth-child(1) {

                            text-align: right;
                        }

                        &:nth-child(2) {
                            font-size: .24rem;
                        }
                    }
                }

            }

            .weather {
                position: absolute;
                left: 0.725rem;
                top: 0.35rem;
                font-size: 0.25rem;
                color: rgba(126, 240, 255, .7);

                img {
                    width: .45rem;
                }

                span {
                    display: inline-block;
                }

                .tem {
                    margin: 0 .1rem 0 .2rem;
                }
            }

            .showTime {
                position: absolute;
                right: 1.375rem;
                top: .35rem;
                color: rgba(126, 240, 255, .7);
                display: flex;

                .time {
                    font-size: .68rem;
                    margin-right: .18rem;
                }

                .date {

                    span {
                        display: block;

                        &:nth-child(1) {
                            font-size: .22rem;
                            text-align: right;
                        }

                        &:nth-child(2) {
                            font-size: .24rem;
                        }
                    }
                }
            }
        }

        .mainbox {
            min-width: 100%;
            max-width: 100%;
            padding: 0.125rem .45rem 0;
            display: flex;
           
 
            .item {
                flex: 4;
                
                    
                &.center {
                    flex: 5;
                    margin: 0 0.125rem 0.1rem;
                    overflow: hidden;

                    .resume {
                        background: rgba(101, 132, 226, 0.1);
                        padding: 0.1875rem;

                        .resume-hd {
                            position: relative;
                            border: 1px solid rgba(25, 186, 139, 0.17);

                            ul {
                                display: flex;

                                %li-line {
                                    content: "";
                                    position: absolute;
                                    height: 50%;
                                    width: 1px;
                                    background: rgba(255, 255, 255, 0.2);
                                    top: 25%;
                                }

                                li {
                                    position: relative;
                                    flex: 1;
                                    text-align: center;
                                    height: 1.2rem;
                                    line-height: 1.2rem;
                                    font-size: 0.65rem;
                                    color: #ffeb7b;
                                    padding: 0.05rem 0;
                                    font-family: 'DIGITALDREAMFAT';
                                    font-weight: bold;

                                    &:nth-child(2) {
                                        &:after {
                                            @extend %li-line;
                                            right: 0;
                                        }

                                        &:before {
                                            @extend %li-line;
                                            left: 0;
                                        }
                                    }
                                }
                            }

                            &:before {
                                content: "";
                                position: absolute;
                                width: 30px;
                                height: 10px;
                                border-top: 2px solid #02a6b5;
                                border-left: 2px solid #02a6b5;
                                top: 0;
                                left: 0;
                            }

                            &:after {
                                content: "";
                                position: absolute;
                                width: 30px;
                                height: 10px;
                                border-bottom: 2px solid #02a6b5;
                                border-right: 2px solid #02a6b5;
                                right: 0;
                                bottom: 0;
                            }
                        }

                        .resume-bd {
                            ul {
                                display: flex;

                                li {
                                    flex: 1;
                                    height: 0.5rem;
                                    line-height: 0.5rem;
                                    text-align: center;
                                    font-size: 0.225rem;
                                    color: rgba(255, 255, 255, 0.7);
                                    padding-top: 0.125rem;
                                }
                            }
                        }
                    }
                }



                .panel {
                    position: relative;
                    height: 12.35rem;
                    width: 23rem;
                    border: 1px solid rgba(25, 186, 139, 0.17);
                    background: url(../../../assets/img/brand/line.png),url(../../../assets/img/brand/veoneer_logo.png) no-repeat ;
                    background-position: 0 0.1875rem, center 7.1125rem;
                    padding: 0 0.1875rem 0;
                    margin-bottom: 0.1875rem;

                    &:before {
                        position: absolute;
                        top: 0;
                        left: 0;
                        content: "";
                        width: 10px;
                        height: 10px;
                        border-top: 2px solid #02a6b5;
                        border-left: 2px solid #02a6b5;
                    }

                    &:after {
                        position: absolute;
                        top: 0;
                        right: 0;
                        content: "";
                        width: 10px;
                        height: 10px;
                        border-top: 2px solid #02a6b5;
                        border-right: 2px solid #02a6b5;
                    }

                  

                    .panel-footer {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;

                        &:before {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            content: "";
                            width: 10px;
                            height: 10px;
                            border-bottom: 2px solid #02a6b5;
                            border-left: 2px solid #02a6b5;
                        }

                        &:after {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            content: "";
                            width: 10px;
                            height: 10px;
                            border-bottom: 2px solid #02a6b5;
                            border-right: 2px solid #02a6b5;
                        }
                    }

                    h2 {
                        height: 0.6rem;
                        line-height: 0.6rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.225rem;
                        font-weight: 400;

                        a {
                            margin: 0 0.1875rem;
                            color: #fff;
                            text-decoration: none;
                        }
                    }

                    .chart {
                        height: 3rem;
                    }
                }
            }

        }

    }

}

@-webkit-keyframes rotate {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@keyframes rotate {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@-webkit-keyframes rotate1 {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(-360deg);
    }
}

@keyframes rotate1 {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(-360deg);
    }
}

@media screen and (max-width: 1024px) {
    html {
        font-size: 42px !important;
    }
}

@media screen and (min-width: 1920) {
    html {
        font-size: 80px !important;
    }
}
</style>
  