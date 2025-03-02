import request from "@/utils/request";

const PMSDEFECT_BASE_URL = "/api/v1/pmsDefects";

const PmsDefectAPI = {
  /** 获取缺陷管理分页数据 */
  getPage(queryParams?: PmsDefectPageQuery) {
    return request<any, PageResult<PmsDefectPageVO[]>>({
      url: `${PMSDEFECT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取缺陷管理表单数据
   *
   * @param id 缺陷管理ID
   * @returns 缺陷管理表单数据
   */
  getFormData(id: number) {
    return request<any, PmsDefectForm>({
      url: `${PMSDEFECT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加缺陷管理*/
  add(data: PmsDefectForm) {
    return request({
      url: `${PMSDEFECT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新缺陷管理
   *
   * @param id 缺陷管理ID
   * @param data 缺陷管理表单数据
   */
  update(id: number, data: PmsDefectForm) {
    return request({
      url: `${PMSDEFECT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除缺陷管理，多个以英文逗号(,)分割
   *
   * @param ids 缺陷管理ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSDEFECT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsDefectAPI;

/** 缺陷管理分页查询参数 */
export interface PmsDefectPageQuery extends PageQuery {}

/** 缺陷管理表单对象 */
export interface PmsDefectForm {
  /** 缺陷ID */
  defectId?: number;
  /** 项目ID */
  projectId?: number;
  /** 缺陷名称 */
  defectName?: string;
  /** 缺陷提出人 */
  proposer?: string;
  /** 缺陷修复人 */
  fixer?: string;
  /** 缺陷提出时间 */
  proposeTime?: Date;
  /** 缺陷修复时间 */
  fixTime?: Date;
  /** 缺陷修复状态 */
  fixStatus?: string;
  /** 缺陷优先级 */
  priority?: string;
  /** 缺陷类型 */
  defectType?: string;
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

/** 缺陷管理分页对象 */
export interface PmsDefectPageVO {
  /** 缺陷ID */
  defectId?: number;
  /** 项目ID */
  projectId?: number;
  /** 缺陷名称 */
  defectName?: string;
  /** 缺陷提出人 */
  proposer?: string;
  /** 缺陷修复人 */
  fixer?: string;
  /** 缺陷提出时间 */
  proposeTime?: Date;
  /** 缺陷修复时间 */
  fixTime?: Date;
  /** 缺陷修复状态 */
  fixStatus?: string;
  /** 缺陷优先级 */
  priority?: string;
  /** 缺陷类型 */
  defectType?: string;
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
