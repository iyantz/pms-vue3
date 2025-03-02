import request from "@/utils/request";

const PMSRELEASE_BASE_URL = "/api/v1/pmsReleases";

const PmsReleaseAPI = {
  /** 获取发布列表分页数据 */
  getPage(queryParams?: PmsReleasePageQuery) {
    return request<any, PageResult<PmsReleasePageVO[]>>({
      url: `${PMSRELEASE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取发布列表表单数据
   *
   * @param id 发布列表ID
   * @returns 发布列表表单数据
   */
  getFormData(id: number) {
    return request<any, PmsReleaseForm>({
      url: `${PMSRELEASE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加发布列表*/
  add(data: PmsReleaseForm) {
    return request({
      url: `${PMSRELEASE_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新发布列表
   *
   * @param id 发布列表ID
   * @param data 发布列表表单数据
   */
  update(id: number, data: PmsReleaseForm) {
    return request({
      url: `${PMSRELEASE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除发布列表，多个以英文逗号(,)分割
   *
   * @param ids 发布列表ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSRELEASE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsReleaseAPI;

/** 发布列表分页查询参数 */
export interface PmsReleasePageQuery extends PageQuery {}

/** 发布列表表单对象 */
export interface PmsReleaseForm {
  /** 发布ID */
  releaseId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划版本 */
  planVersion?: string;
  /** 发布模块 */
  releaseModule?: string;
  /** 发布时间 */
  releaseTime?: Date;
  /** 描述 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}

/** 发布列表分页对象 */
export interface PmsReleasePageVO {
  /** 发布ID */
  releaseId?: number;
  /** 项目ID */
  projectId?: number;
  /** 计划版本 */
  planVersion?: string;
  /** 发布模块 */
  releaseModule?: string;
  /** 发布时间 */
  releaseTime?: Date;
  /** 描述 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}
