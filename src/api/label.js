import request from '@/utils/request'



export default {


    // 条件查询标签列表
    searchLabelList(query, current = 1, size = 20) {

        return request({
            url: '/article/label/search',
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    // 新增提交

    add(data) {
        return request({
            url: '/article/label',
            method: 'post',
            data
        })
    },
    // 
    getLabelById(id) {
        return request({
            url: `/article/label/${id}`,
            method: 'get'
        })
    },
    update(id, data) {
        return request({
            url: `article/label/${id}`,
            method: 'put',
            data
        })
    },
    delete(id) {
        return request({
            url: `article/label/${id}`,
            method: 'delete',

        })
    }

}