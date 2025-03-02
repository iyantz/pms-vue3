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
          v-hasPerm="['project:pmsRequirement:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['project:pmsRequirement:delete']"
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
        <el-table-column label="项目ID" width="150" align="center">
          <template #default="scope">
            <DictLabel v-model="scope.row.projectId" code="DICT_PUBLISH_TYPE" />
          </template>
        </el-table-column>
        <el-table-column
          key="requirementName"
          label="需求名称"
          prop="requirementName"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="proposer"
          label="需求提出人"
          prop="proposer"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="proposeTime"
          label="需求提出时间"
          prop="proposeTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="expectFinishTime"
          label="预计完成时间"
          prop="expectFinishTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="完成状态"
          prop="status"
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
          key="createTime"
          label="创建时间"
          prop="createTime"
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
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['project:pmsRequirement:edit']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['project:pmsRequirement:delete']"
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

    <!-- 需求信息表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="项目ID" prop="projectId">
          <dict v-model="formData.projectId" code="DICT_PUBLISH_TYPE" />
        </el-form-item>

        <el-form-item label="需求名称" prop="requirementName">
          <el-input v-model="formData.requirementName" placeholder="需求名称" />
        </el-form-item>

        <el-form-item label="需求提出人" prop="proposer">
          <el-input v-model="formData.proposer" placeholder="需求提出人" />
        </el-form-item>

        <el-form-item label="需求提出时间" prop="proposeTime">
          <el-date-picker
            v-model="formData.proposeTime"
            type="datetime"
            placeholder="需求提出时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="预计完成时间" prop="expectFinishTime">
          <el-date-picker
            v-model="formData.expectFinishTime"
            type="datetime"
            placeholder="预计完成时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="完成状态" prop="status">
          <el-input v-model="formData.status" placeholder="完成状态" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" placeholder="描述" />
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            placeholder="创建时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker
            v-model="formData.updateTime"
            type="datetime"
            placeholder="更新时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
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
  name: "PmsRequirement",
  inheritAttrs: false,
});

import PmsRequirementAPI, {
  PmsRequirementPageVO,
  PmsRequirementForm,
  PmsRequirementPageQuery,
} from "@/api/project/pms-requirement";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PmsRequirementPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 需求信息表格数据
const pageData = ref<PmsRequirementPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 需求信息表单数据
const formData = reactive<PmsRequirementForm>({});

// 需求信息表单校验规则
const rules = reactive({});

/** 查询需求信息 */
function handleQuery() {
  loading.value = true;
  PmsRequirementAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置需求信息查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开需求信息弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改需求信息";
    PmsRequirementAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增需求信息";
  }
}

/** 提交需求信息表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        PmsRequirementAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PmsRequirementAPI.add(formData)
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

/** 关闭需求信息弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除需求信息 */
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
      PmsRequirementAPI.deleteByIds(ids)
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
