<template>
  <div class="app-container" >

    <!-- 条件查询 -->
    <el-form inline :model="query" size="mini" class="demo-form-inline">
      <el-form-item label="分类名称:">
        <el-input v-model.trim="query.categoryName" ></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select filterable clearable v-model="query.status" placeholder="请选择">
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  ref="btn"  icon="el-icon-search" type="primary" @click="search">查询</el-button>
          <el-button @click="reload" icon="el-icon-refresh">重置</el-button>
          <el-button @click="add" inco="el-icon-circle-plus-outline" type="primary">新增</el-button>
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
        <el-table-column  v-for="item in tableColumnLists" :key="item.prop" :prop="item.prop" :label="item.label"  :align="item.align"  >
        </el-table-column>

        <el-table-column prop="status" label="状态" align="center">

          <template slot-scope="scope">
            <el-tag :type="scope.row.status.toString()|filterStatus">{{scope.row.status?'正常':'禁用'}}</el-tag>
          </template>

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

    <!-- 新增对话框组件 -->
    <category-dialog :title="title" :isShowDialog="isShowDialog" :formData ="formData" :remoteClose="remoteClose"></category-dialog>
  </div>
</template>

<script>
import CategoryDialog from './CategoryDialog'
import api from '@/api/category' 


  export default {

    
    name: 'Category',
    components:{
      CategoryDialog
    },
    data(){
      return {
        tableColumnLists:[
          
          {prop:'name',label:'分类名称',align:'center'},
          {prop:'remark',label:'备注',align:'center'},
          {prop:'sort',label:'排序',align:'center'},
        ],
        lists:[],
        query:{
          categoryName: '',
          status: ''
        },
        page:{ //
          current:1,
          size:20,
          total:0
        },
        title:'',
        isShowDialog:false,
        formData:{},
        // 新增弹窗
        addEdit:{
          title:'新增',
          formData:{
            sort:1

        }
        },

        // 修改弹窗
        amend:{
          title:'修改',
          formData:{}
        }
      }
    },
     created(){
      
       this.fetchData()
     },
     filters:{
       filterStatus(status){
          let statusMap  = {
            0:'danger',
            1:'success'
          }
          
          return statusMap[status]
       }
     },
     methods: {
     async  fetchData() {
        let result=   await api.getList(this.query,this.page.current,this.page.size)
        let  {data:{total,records}}  =result
        this.lists=records
        this.page.total=total
       
        
       },

     async  handleEdit(id){
       this.formData =this.amend.formData
        this.title=this.amend.title
         this.isShowDialog=true
        let result=  await api.searchCategoryById(id)
        
        this.formData = result.data


       },
     async  deleteCurrentArticleCategory(id){
           let result = await api.delete(id)
           if(result.code===20000) {
             // 
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchData()
           } else {
             this.$message({
              type: 'error',
              message: '删除失败!'
            });
           }
       },
       handleDelete(id){

          this.$confirm('此操作将永久删除这条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            this.deleteCurrentArticleCategory(id)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

       },
      // val  切换之后每页查询的数据条数
       handleSizeChange(val){
          this.page.size= val
          this.fetchData()
       },
      // val 点击的那个页码或者输入的页码 
       handleCurrentChange(val){
         this.page.current =val
          this.fetchData()
       
       },
       search(){
          this.page.current=1
          this.page.size=20
          this.fetchData()

         
       },
       reload(){
          this.query={}
          this.fetchData()
       },
       add(){
          
          this.formData=this.addEdit.formData
          this.title=this.addEdit.title
          this.isShowDialog=true
         
       },
       remoteClose(){
        //  防止可能出现输入不了的情况
         this.add.formData={}
         this.isShowDialog=false

         this.fetchData()
       }
     },
  }
</script>

<style lang="scss" scoped>
  .category{
    width:100%;
    height: 100%;
    box-sizing: border-box;
    padding: 50px;
  }
</style>