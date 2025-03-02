<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button v-hasPerm="['task:pmsDefect:add']" type="success" @click="handleOpenDialog()">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['task:pmsDefect:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          key="defectId"
          label="缺陷ID"
          prop="defectId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="projectId"
          label="项目ID"
          prop="projectId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="defectName"
          label="缺陷名称"
          prop="defectName"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="proposer"
          label="缺陷提出人"
          prop="proposer"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="fixer"
          label="缺陷修复人"
          prop="fixer"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="proposeTime"
          label="缺陷提出时间"
          prop="proposeTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="fixTime"
          label="缺陷修复时间"
          prop="fixTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="fixStatus"
          label="缺陷修复状态"
          prop="fixStatus"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="priority"
          label="缺陷优先级"
          prop="priority"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="defectType"
          label="缺陷类型"
          prop="defectType"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="description"
          label="描述"
          prop="description"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createBy"
          label="创建人ID"
          prop="createBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="创建时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateBy"
          label="更新人ID"
          prop="updateBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateTime"
          label="更新时间"
          prop="updateTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isDeleted"
          label="是否删除（0: 未删除, 1: 已删除）"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['task:pmsDefect:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['task:pmsDefect:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- 缺陷管理表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-input v-model="formData.defectId" type="hidden" />
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="formData.projectId" placeholder="项目ID" />
        </el-form-item>

        <el-form-item label="缺陷名称" prop="defectName">
          <el-input v-model="formData.defectName" placeholder="缺陷名称" />
        </el-form-item>

        <el-form-item label="缺陷提出人" prop="proposer">
          <el-input v-model="formData.proposer" placeholder="缺陷提出人" />
        </el-form-item>

        <el-form-item label="缺陷修复人" prop="fixer">
          <el-input v-model="formData.fixer" placeholder="缺陷修复人" />
        </el-form-item>

        <el-form-item label="缺陷提出时间" prop="proposeTime">
          <el-date-picker
            v-model="formData.proposeTime"
            type="datetime"
            placeholder="缺陷提出时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="缺陷修复时间" prop="fixTime">
          <el-date-picker
            v-model="formData.fixTime"
            type="datetime"
            placeholder="缺陷修复时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="缺陷修复状态" prop="fixStatus">
          <el-input v-model="formData.fixStatus" placeholder="缺陷修复状态" />
        </el-form-item>

        <el-form-item label="缺陷优先级" prop="priority">
          <el-input v-model="formData.priority" placeholder="缺陷优先级" />
        </el-form-item>

        <el-form-item label="缺陷类型" prop="defectType">
          <el-input v-model="formData.defectType" placeholder="缺陷类型" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" placeholder="描述" />
        </el-form-item>

        <el-input v-model="formData.createBy" type="hidden" />
        <el-input v-model="formData.createTime" type="hidden" />
        <el-input v-model="formData.updateBy" type="hidden" />
        <el-input v-model="formData.updateTime" type="hidden" />
        <el-input v-model="formData.isDeleted" type="hidden" />
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "PmsDefect",
  inheritAttrs: false,
});

import PmsDefectAPI, {
  PmsDefectPageVO,
  PmsDefectForm,
  PmsDefectPageQuery,
} from "@/api/task/pms-defect";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PmsDefectPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 缺陷管理表格数据
const pageData = ref<PmsDefectPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 缺陷管理表单数据
const formData = reactive<PmsDefectForm>({});

// 缺陷管理表单校验规则
const rules = reactive({
  defectId: [{ required: true, message: "请输入缺陷ID", trigger: "blur" }],
  projectId: [{ required: true, message: "请输入项目ID", trigger: "blur" }],
  createBy: [{ required: true, message: "请输入创建人ID", trigger: "blur" }],
  createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
});

/** 查询缺陷管理 */
function handleQuery() {
  loading.value = true;
  PmsDefectAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置缺陷管理查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开缺陷管理弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改缺陷管理";
    PmsDefectAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增缺陷管理";
  }
}

/** 提交缺陷管理表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        PmsDefectAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PmsDefectAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭缺陷管理弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除缺陷管理 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      PmsDefectAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
