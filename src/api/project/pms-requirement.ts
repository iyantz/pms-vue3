import request from "@/utils/request";

const PMSREQUIREMENT_BASE_URL = "/api/v1/pmsRequirements";

const PmsRequirementAPI = {
  /** 获取需求信息分页数据 */
  getPage(queryParams?: PmsRequirementPageQuery) {
    return request<any, PageResult<PmsRequirementPageVO[]>>({
      url: `${PMSREQUIREMENT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取需求信息表单数据
   *
   * @param id 需求信息ID
   * @returns 需求信息表单数据
   */
  getFormData(id: number) {
    return request<any, PmsRequirementForm>({
      url: `${PMSREQUIREMENT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加需求信息*/
  add(data: PmsRequirementForm) {
    return request({
      url: `${PMSREQUIREMENT_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新需求信息
   *
   * @param id 需求信息ID
   * @param data 需求信息表单数据
   */
  update(id: number, data: PmsRequirementForm) {
    return request({
      url: `${PMSREQUIREMENT_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除需求信息，多个以英文逗号(,)分割
   *
   * @param ids 需求信息ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${PMSREQUIREMENT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PmsRequirementAPI;

/** 需求信息分页查询参数 */
export interface PmsRequirementPageQuery extends PageQuery {}

/** 需求信息表单对象 */
export interface PmsRequirementForm {
  /** 项目ID */
  projectId?: number;
  /** 需求名称 */
  requirementName?: string;
  /** 需求提出人 */
  proposer?: string;
  /** 需求提出时间 */
  proposeTime?: Date;
  /** 预计完成时间 */
  expectFinishTime?: Date;
  /** 完成状态 */
  status?: number;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 需求信息分页对象 */
export interface PmsRequirementPageVO {
  /** 项目ID */
  projectId?: number;
  /** 需求名称 */
  requirementName?: string;
  /** 需求提出人 */
  proposer?: string;
  /** 需求提出时间 */
  proposeTime?: Date;
  /** 预计完成时间 */
  expectFinishTime?: Date;
  /** 完成状态 */
  status?: number;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
