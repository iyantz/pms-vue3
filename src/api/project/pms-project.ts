import request from "@/utils/request";

const PMSPROJECT_BASE_URL = "/api/v1/pmsProjects";

const PmsProjectAPI = {
  /** 获取项目信息分页数据 */
  getPage(queryParams?: PmsProjectPageQuery) {
    return request<any, PageResult<PmsProjectPageVO[]>>({
      url: `${PMSPROJECT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取项目信息表单数据
   *
   * @param id 项目信息ID
   * @returns 项目信息表单数据
   */
  getFormData(id: number) {
    return request<any, PmsProjectForm>({
      url: `${PMSPROJECT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加项目信息*/
  add(data: PmsProjectForm) {
    return request({
      url: `${PMSPROJECT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新项目信息
   *
   * @param id 项目信息ID
   * @param data 项目信息表单数据
   */
  update(id: number, data: PmsProjectForm) {
    return request({
      url: `${PMSPROJECT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除项目信息，多个以英文逗号(,)分割
   *
   * @param ids 项目信息ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSPROJECT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsProjectAPI;

/** 项目信息分页查询参数 */
export interface PmsProjectPageQuery extends PageQuery {}

/** 项目信息表单对象 */
export interface PmsProjectForm {
  /** 项目ID */
  projectId?: number;
  /** 项目名称 */
  projectName?: string;
  /** 项目简称 */
  projectShortName?: string;
  /** 合同甲方 */
  partyA?: string;
  /** 合同乙方 */
  partyB?: string;
  /** 项目周期 */
  projectPeriod?: string;
  /** 项目金额 */
  projectAmount?: number;
  /** 简介 */
  description?: string;
  /** 备注 */
  remark?: string;
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

/** 项目信息分页对象 */
export interface PmsProjectPageVO {
  /** 项目ID */
  projectId?: number;
  /** 项目名称 */
  projectName?: string;
  /** 项目简称 */
  projectShortName?: string;
  /** 合同甲方 */
  partyA?: string;
  /** 合同乙方 */
  partyB?: string;
  /** 项目周期 */
  projectPeriod?: string;
  /** 项目金额 */
  projectAmount?: number;
  /** 简介 */
  description?: string;
  /** 备注 */
  remark?: string;
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
