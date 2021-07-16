<template>
  <div class="app-container">
       <!-- 条件查询 -->
    <el-form inline :model="query" size="mini" class="demo-form-inline">
      <el-form-item label="标签名称:">
        <el-input v-model.trim="query.name" ></el-input>
      </el-form-item>
      <el-form-item label="分类名称:">
        <el-select filterable clearable v-model="query.categoryName" placeholder="请选择">
          <el-option  v-for=" item in normalCategoryLists " :key="item.id" :label="item.name" :value="item.id"></el-option>
          
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
          <el-button @click="reload" icon="el-icon-refresh">重置</el-button>
          <el-button @click="addLabel" inco="el-icon-circle-plus-outline" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
        <!-- 表格组件 -->
      <el-table
        :data="lists"
        border
        stripe
        :height="632"
   
       >
        <el-table-column  align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column  align="center" prop="name"  label="标签名称" >
        </el-table-column>

         <el-table-column  align="center"   prop="categoryName"   label="分类名称" >
        </el-table-column>
        <el-table-column align="center" width="200" ref="tableColunm" label="操作">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> 
      </el-table>
            <!-- 分页组件 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[20,40,60,80,100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

    <!-- 对话框组件 -->

    <label-dialog :title="title" :isShowDialog="isShowDialog" :remoteClose="remoteClose" :formData="formData" :normalCategoryLists="normalCategoryLists"></label-dialog>
  </div>
</template>

<script>
  import api from '@/api/label'
  import categoryApi from '@/api/category'
  import LabelDialog from './LabelDialog'
  export default {
    name: 'Label',

    data(){
       return  {
          lists:[],
          query:{}, //条件查询
          page:{
            current:1,
            size:20,
            total:0
          },
          normalCategoryLists:[],
          formData:{},
          isShowDialog:false,
          title:'',
          // 新增状态
          add:{
            title:'新增'
           
          },
          // 编辑状态
          edit:{
            title:'修改'
          }

       }
    },

    components:{
      LabelDialog
    },
    created(){
      this.fetchData()
      this.searchNormalCategoryLists()
    },
    mounted(){
      // this.title='我是父组件传递过来的'
    },
    methods: {
    async  fetchData(){
      let {query,page:{current,size}} = this
     let result=await  api.searchLabelList(query,current,size)
      let {data:{total,records}} = result
      this.page.total= total
      this.lists= records
     
      },
    async  searchNormalCategoryLists(){
        let result = await  categoryApi.searchNormalCategoryList()

         let {data} = result

         this.normalCategoryLists=data
      },
      handleEdit(id) {
        // 首先弹出修改对话框
        this.isShowDialog= true
        this.title=this.edit.title
        api.getLabelById(id).then((result)=>{
            this.formData=result.data
        })
      },
    async  deleteLabel(id){
     let result=  await  api.delete(id)
      if(result.code===20000) {
        this.$message({
          type:'success',
          message:'删除成功'

        })

        this.fetchData()
      }else {
        this.$message({
          type:'error',
          message:'删除失败'

        })
      }
      },

      handleDelete(id){
         this.$confirm('是否永久删除这个标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLabel(id)
         
        }).catch(() => {
               
        });
      },
      handleSizeChange(val){
        this.page.size=val
        this.fetchData()
      },
      handleCurrentChange(val){
        this.page.current=val
        this.fetchData()
      },
      // 条件查询
      search(){
  
         this.fetchData()
      },
      // 重置
      reload(){
        this.query={}
        this.fetchData()
      },
      addLabel(){
        this.isShowDialog=true
        this.title=this.add.title
      
     
      },
      // 关闭对话框
      remoteClose(){
        // 清空表单
        this.formData={}
        this.isShowDialog=false
        this.fetchData()
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>