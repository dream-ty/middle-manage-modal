<template>
   
        <el-dialog
            :title="title"
            :visible.sync="isShowDialog"
             width="1000px"
            :before-close="handleClose">
    
                  <el-form  :model="formData" label-width="100px" label-position="right" style="display:block" >
            <el-form-item   label="标题:">
                <el-input style="width:300px "  readonly v-model="formData.title"> </el-input>
            </el-form-item>
           
             <el-form-item   label="标签:">
                <el-cascader
                disabled
                v-model="formData.labelIds"
                :options="categoryAndLabellist"
                 :props=" { multiple: true ,children:'labelList',value:'id',label:'name', emitPath:false}"
                 style="display:block"
                
                @change="handleChange">
                </el-cascader>
            </el-form-item>
                  
             <el-form-item   label="主图:">
                 <img :src="formData.imageUrl" style="width:200px;height:200px;display:block" >
               
            </el-form-item>

             <el-form-item   label="是否公开:">
                  <el-radio-group v-model="formData.ispublic" disabled >
                    <el-radio :label="0">不公开</el-radio>
                    <el-radio :label="1">公开</el-radio>
                   </el-radio-group>
            </el-form-item>
     
            <el-form-item label="简介">
                <el-input type="textarea" readonly v-model="formData.summary"></el-input>
            </el-form-item>

              <el-form-item   label="内容:">
               <mavon-editor v-model="formData.mdContent" :editable="false"></mavon-editor>
            </el-form-item>
             <el-form-item v-if="isHasBtn">
                 <el-button type="primary" size="medium " @click="checkIsOk" :style="{marginLeft:'288px'}" >审核通过</el-button>
                 <el-button size="medium " type="danger" @click="checkIsNotOk" >审核不通过</el-button>
             </el-form-item>
               
        </el-form>
         </el-dialog>
</template>

<script>
import api from '@/api/article'
import categoryApi from '@/api/category'
// 引入mavonEditor组件和样式
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
    export default {
        data(){
            return {
                formData:{},
                categoryAndLabellist:[]
            }
        },
        components:{
            mavonEditor
        },
        props:{
            isShowDialog:{
                required:true,
                type:Boolean,
                default:false
            },
            title:{
                required:true,
                type:String,
                default:''

            },
             articleId:{
                 required:true,
                 type:Number

             },
             remoteClose:Function,
             isHasBtn:{
                 required:true,
                 type:Boolean
             }
        },
        watch: {
          articleId() {
              this.getArticle()
              this.getLabelOptions()
          }
         },
        methods:{
       async getArticle(){

       let result= await    api.getArticleById(this.articleId)

        this.formData=result.data
        },
            // 关闭对话框
        handleClose(){
            this.remoteClose()
        },
        checkIsOk(){
          this.$confirm('确认审核通过吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           api.checkIsPassed(this.articleId).then((result)=>{
               if(result.code===20000) {
                   this.$message({
                       type:'success',
                       message:'操作成功'
                   })

                   this.remoteClose()
               }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        },
        checkIsNotOk(){
              this.$confirm('确认审核不通过吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           api.checkIsNoPassed(this.articleId).then((result)=>{
               if(result.code===20000) {
                   this.$message({
                       type:'success',
                       message:'操作成功'
                   })

                   this.remoteClose()
               }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        },
      async  getLabelOptions(){
          let result =await categoryApi.getCategoryAndLabel()
            this.categoryAndLabellist= result.data
            console.log( this.categoryAndLabellist,' this.categoryAndLabellist');
        },
        handleChange(){
            console.log(this.formData.labelIds,'labelIds');
        }
        }
    }
</script>

<style lang="scss" scoped>
    
</style>