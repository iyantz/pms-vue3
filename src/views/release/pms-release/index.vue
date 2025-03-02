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
        <el-button
          v-hasPerm="['release:pmsRelease:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['release:pmsRelease:delete']"
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
          key="releaseId"
          label="发布ID"
          prop="releaseId"
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
          key="planVersion"
          label="计划版本"
          prop="planVersion"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="releaseModule"
          label="发布模块"
          prop="releaseModule"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="releaseTime"
          label="发布时间"
          prop="releaseTime"
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
              v-hasPerm="['release:pmsRelease:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['release:pmsRelease:delete']"
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

    <!-- 发布列表表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-input v-model="formData.releaseId" type="hidden" />
        <el-input v-model="formData.projectId" type="hidden" />
        <el-form-item label="计划版本" prop="planVersion">
          <el-input v-model="formData.planVersion" placeholder="计划版本" />
        </el-form-item>

        <el-form-item label="发布模块" prop="releaseModule">
          <el-input v-model="formData.releaseModule" placeholder="发布模块" />
        </el-form-item>

        <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker
            v-model="formData.releaseTime"
            type="datetime"
            placeholder="发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
  name: "PmsRelease",
  inheritAttrs: false,
});

import PmsReleaseAPI, {
  PmsReleasePageVO,
  PmsReleaseForm,
  PmsReleasePageQuery,
} from "@/api/release/pms-release";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PmsReleasePageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 发布列表表格数据
const pageData = ref<PmsReleasePageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 发布列表表单数据
const formData = reactive<PmsReleaseForm>({});

// 发布列表表单校验规则
const rules = reactive({
  releaseId: [{ required: true, message: "请输入发布ID", trigger: "blur" }],
  createBy: [{ required: true, message: "请输入创建人ID", trigger: "blur" }],
  createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
});

/** 查询发布列表 */
function handleQuery() {
  loading.value = true;
  PmsReleaseAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置发布列表查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开发布列表弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改发布列表";
    PmsReleaseAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增发布列表";
  }
}

/** 提交发布列表表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        PmsReleaseAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PmsReleaseAPI.add(formData)
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

/** 关闭发布列表弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除发布列表 */
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
      PmsReleaseAPI.deleteByIds(ids)
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
