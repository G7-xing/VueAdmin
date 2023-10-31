<template>
    <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
      </el-table> -->
        <vxe-table border resizable show-overflow keep-source ref="xTable" height="500" :loading="loading" :data="tableData"
            :edit-config="{ trigger: 'manual', mode: 'row' }">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column v-for="item in tableHeader" :key="item" :field="item" :title="item" :width="100"></vxe-column>
            <vxe-column title="操作" width="240">
                <template #default="{ row }">
                    <template v-if="$refs.xTable.isActiveByRow(row)">
                        <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                        <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                    </template>
                    <template v-else>
                        <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                    </template>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>
  
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import VXETable from 'vxe-table'
import { mapState } from 'vuex'

export default {
    name: 'UploadExcel',
    components: { UploadExcelComponent },
    data() {
        return {
            loading: false,
            tableData: [],
            tableHeader: []
        }
    },
    methods: {
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
            debugger
            this.tableData = results
            this.tableHeader = header
        },
        async removeRowEvent(row) {
            const $table = this.$refs.xTable
            await $table.remove(row)
        },
        async deleteRowEvent(row) {
            const type = await VXETable.modal.confirm('您确定要删除该数据?')
            if (type !== 'confirm') {
                return
            }
            this.loading = true
            try {
                const body = { removeRecords: [row] }
                //await fetch(`${this.serveApiUrl}/api/pub/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                //await this.loadList()
            } catch (e) { }
        },
        editRowEvent(row) {
            debugger
            const $table = this.$refs.xTable
            $table.setActiveRow(row)
        },
        saveRowEvent() {
            const $table = this.$refs.xTable
            $table.clearActived().then(() => {
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                    VXETable.modal.message({ content: '保存成功！', status: 'success' })
                }, 300)
            })
        },
        cancelRowEvent(row) {
            const $table = this.$refs.xTable
            $table.clearActived().then(() => {
                // 还原行数据
                $table.revertData(row)
            })
        }
    }
}
</script>
  