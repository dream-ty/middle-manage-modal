<template>
    <div class="app-container">
         <!-- 条件查询 -->
      <el-form inline :model="query" size="mini" class="demo-form-inline">
        <el-form-item label="文章标题:">
          <el-input v-model.trim="query.title" ></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select filterable clearable v-model="query.status" placeholder="请选择">
            <el-option label="已删除" :value="0"></el-option>
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button @click="reload" icon="el-icon-refresh">重置</el-button>
           
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
        <el-table-column  align="center" prop="title" label="文章标题">
        </el-table-column>
        <el-table-column  align="center" prop="viweCount" label="浏览数">
        </el-table-column>
        <el-table-column  align="center" prop="thumhup" label="点赞数">
        </el-table-column>

        <el-table-column  align="center" prop="ispublic" label="是否公开">

          <template slot-scope="scope">
            <el-tag :type="scope.row.ispublic|filterIsPublicStatus">{{scope.row.ispublic==1?'公开':'不公开'}}</el-tag>
          </template>
        </el-table-column>
          <el-table-column  align="center" prop="status" label="状态">

          <template slot-scope="scope">

            <el-tag :type="scope.row.status|filterIsPublicStatus">{{scope.row.status==0?'已删除':scope.row.status==1?'未审核':scope.row.status==2?'审核通过':'审核未通过'}}</el-tag>
          </template>
        </el-table-column>
         <el-table-column  align="center" prop="updateDate" label="最后更新时间">
           <template slot-scope="scope">
             {{scope.row.updateDate|filterDateFormat}}

           </template>
        </el-table-column>
        <el-table-column align="left" width="300" ref="tableColunm" label="操作">
            <template slot-scope="scope">
              <el-button 
                type="primary"
                size="mini"
                :style="{marginLeft:'20px'}"
                @click="view(scope.row.id)">查看</el-button>
              <el-button v-if="scope.row.status===1||scope.row.status===3"
                size="mini"
                type="success"
                @click="check(scope.row.id)">审核</el-button>
              <el-button v-if="!scope.row.status==0"
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
    <article-dialog :isShowDialog="isShowDialog" :title="title" :isHasBtn="isHasBtn" :formData="formData" :articleId="id" :remoteClose="remoteClose"></article-dialog>

    </div>
</template>

<script>
import api from '@/api/article'
import {format} from '@/utils/date'
import ArticleDialog from './ArticleDialog'
    export default {
         name: 'Article',
         data(){
             return {
                // 分页初始化状态
                 page:{
                     current:1,
                     size:20,
                     total:0
                 },
                 query:{},
                 lists:[],
                 title:'',
                 isShowDialog:false,
                 formData:{},
                 id:0,
                  isHasBtn:false,
                //  
                 checkState:{
                   title:'审核文章',
                   isHasBtn:true

                 },
                  viewState:{
                   title:'查看文章',
                     isHasBtn:false
                 }

             }
         },
         components:{
           ArticleDialog
         },
         created(){
             this.fetchData()
         },
         filters: {
          //  过滤是否公开
           filterIsPublicStatus: function(value) {

           let  statusMap ={
               1:'success',
               0:'danger'
             }
             return statusMap[value]
           },
        // 过滤文章的状态
          filterIsPublicStatus:function(value){
            let statusMap ={
              0:'danger',
              1:'',
              2:'success',
              3:'warning'
            }

            return statusMap[value]
          },
          // 过滤日期格式
          filterDateFormat(date){
            return  format(date)
          }
         },
         methods:{
            //  条件列表查询 抓取数据
            async fetchData(){
              let {page:{current,size},query} = this
              let result= await api.search(query,current,size)
              let {data:{records,total}} = result
              this.lists= records
              this.page.total=total
             },
            //  查询
             search(){
               this.fetchData()
              //  this.query={}
             },
            //  重置
             reload( ){
               this.query={}
               this.fetchData()
             },
             handleSizeChange(val){
               this.page.size=val
               this.fetchData()
             },
             handleCurrentChange(val){
               this.page.current=val
               this.fetchData()
             },
            //  查看
             view(id){
               this.isShowDialog=true
                this.id=id
                 this.title= this.viewState.title
              this.isHasBtn=this.viewState.isHasBtn

             },
            //  审核
            check(id){
              this.isShowDialog=true
              this.id=id
              this.title= this.checkState.title
              this.isHasBtn=this.checkState.isHasBtn

            },
            // 删除
            handleDelete(id){
               this.$confirm('确定要删除这条文章的信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           api.delete(id).then((result)=>{
               if(result.code===20000) {
                   this.$message({
                       type:'success',
                       message:'操作成功'
                   })

                   this.fetchData()
               }else {
                 this.$message({
                   type:'error',
                   message:'删除失败'
                 })
               }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
            },
            // 
            remoteClose(){
              this.isShowDialog= false
              this.fetchData()
            }


         }
    }
</script>

<style lang="scss" scoped>

</style>