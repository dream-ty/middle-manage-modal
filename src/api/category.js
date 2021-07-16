import request from '@/utils/request'



export default {


    getList(query, current = 1, size = 20) {

        return request({
            url: `/article/category/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    // 新增分类
    add(formData) {
        return request({
            url: '/article/category',
            method: 'post',
            data: formData
        })
    },
    searchCategoryById(id) {
        return request({
            url: `article/category/${id}`,
            method: 'get'


        })

    },
    // 修改提交
    amendSubmit(id, data) {
        return request({
            url: `article/category/${id}`,
            method: 'put',
            data
        })
    },
    // 删除文章分类
    delete(id) {
        return request({
            url: `article/category/${id}`,
            method: 'delete'

        })
    },
    // 查询正常状态
    searchNormalCategoryList() {


        return request({
            url: '/article/category/list',
            method: 'get'
        })
    },
    // 获取所有正常状态下的分类和标签
    getCategoryAndLabel() {
        return request({
            url: '/article/category/label/list',
            method: 'get'
        })
    }

}