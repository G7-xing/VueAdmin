<template>
  <div>
    <el-row :gutter="20" style="margin-left:0;">
      <el-col :span="4" :xs="24" >
        <el-form>
          <el-form-item label="线体：">
            <el-select v-model="lineId" clearable filterable placeholder="请选择线体" @change="getFileList()">
              <el-option v-for="item in options" :key="item.lineId" :label="item.lineName" :value="item.lineId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table :data="tableData" row-key="fileId" border style="width: 100% ;height: 100%;" sizi="small">
          <el-table-column fixed prop="fileName" label="文件名称">
            <template slot-scope="scope">
              <div class="sub-body" @click="handleClick(scope.row)">{{ scope.row.fileName }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-divider direction="vertical"></el-divider>
      <el-col :span="20" :xs="24">
        <pdf :src="src" class="pdf-class" style="padding: 5px 5px;position: relative;"></pdf>
      </el-col>
    </el-row>



  </div>
</template>

<script>
//引入组件
// import vueOfficeExcel from '@vue-office/excel'
// import vueOfficePdf from '@vue-office/pdf';
import pdf from 'vue-pdf';
//引入相关样式
//import '@vue-office/excel/lib/index.css';
import { fetchAllList } from '@/api/line';
import { getFileData, getFileListByLineId } from '@/api/EWIFile'
//import Axios from 'axios';
export default {
  data() {
    return {
      src: '',
      lineId: '',
      options: [{ lineId: '', lineName: '' }],
      tableData: []
    }
  },
  components: {
    // vueOfficeExcel,
    // vueOfficePdf,
    pdf
  },
  created() {
    this.fetchAllList();
  },
  methods: {
    getFileList() {
      //debugger;
      //console.log(this.lineId);
      getFileListByLineId(this.lineId).then(response => {
        if (response.success) {
          this.tableData = response.data;
          //console.log(this.tableData);
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
      // Axios.request({
      //   method: "post",
      //   url: "http://localhost:9090/EWIFile/ViewFile",
      //   responseType: "blob",
      //   headers: {
      //     "Content-Type": "application/pdf;charset=utf-8",
      //   }
      // }).then(res => {
      //   console.log(res);
      //   this.src = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      // })
      ///////////////////////////
      // getFileData().then(res => {
      //   console.log(res);
      //   this.src = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      // })
    },

    handleClick(row) {
      //debugger;
      //console.log(row);
      getFileData(row.fileId).then(res => {
        //console.log(res);
        debugger;
        if (res.status !== 204) {
          this.src = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
        } else {
          this.$message({
            message: "未找到该文件,请确认是否已经维护",
            type: 'error'
          });
        }

      })
    },
    fetchAllList() {
      this.listLoading = true;
      fetchAllList().then(response => {
        if (response.success) {
          this.listLoading = false;
          this.options = response.data;
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
  },

}
</script>

<style lang="scss" scoped>
.pdf-class canvas {
  //提高指定样式规则的应用优先权（优先级）
  height: 100% !important;
  width: 100% !important;
}

.sub-body {
  color: blue;
}


</style>

