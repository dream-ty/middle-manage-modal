<template>

        <el-dialog
            :title="title"
            :visible.sync="isShowDialog"
             width="400px"
            :before-close="handleClose">
        <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px" status-icon>
            <el-form-item prop="name"  label="标签名称:">
                <el-input style="width:300px " v-model="formData.name" :style="{width:'200px'}"> </el-input>
            </el-form-item>
             <el-form-item prop="categoryId"  label="分类名称:">
                  <el-select  clearable v-model="formData.categoryId" placeholder="请选择">
                    <el-option v-for="item in normalCategoryLists" :key="item.id" :value="item.id" :label="item.name">    </el-option>
                  </el-select>
            </el-form-item>
             <el-form-item>
                 <el-button type="primary" size="mini" @click="formData.id?updateSubmit('formData'):addSubmit('formData')"  :style="{marginLeft:'77px'}">确定</el-button>
                 <el-button size="mini" @click="handleClose">取消</el-button>
             </el-form-item>
               
        </el-form>
        </el-dialog>

</template>

<script>

import api from '@/api/label'
    export default {

        props:{
            title:{
                type:String,
                default:''
            },
            isShowDialog:{
                type:Boolean,
                default:false
            },
            formData:{
                type:Object,
                default:()=>({})
            },
            remoteClose:Function,
            normalCategoryLists:{
                type:Array,
                default:()=>([])
            }
        },

        data(){
            return {
                rules:{
                    name:[ { required: true, message: '请输入标签名称', trigger: 'blur' },
                          { min: 3, max: 5, message: '长度在3到5个字符', trigger: 'blur' }],
                    categoryId:[{required:true,message:'请输入分类名称',trigger:'change'}]
                }
            }
        },

   
    created(){
  
     console.log(this,'子组件');
    
    },
   
    methods: {
        handleClose(){
                // 重置表单
                this.$refs.formData.resetFields()
                this.remoteClose()
        },
        // 更新
        updateSubmit() {
            this.$refs.formData.validate((valid)=>{
                if(valid){
                    api.update(this.formData.id,this.formData).then((result)=>{
                        if(result.code===20000) {
                            this.$message({
                                showClose:true,
                                message:'更新成功',
                                type:'success'
                            })
                            this.handleClose()
                        }else {
                             this.$message({
                                showClose:true,
                                message:'更新失败',
                                type:'error'
                            })
                              this.handleClose()
                        }
                    })
                }else {
                }
            })
        },
        // 新增提交
        addSubmit(){
            // 
            console.log(111);
            this.$refs.formData.validate((valid)=>{
                if(valid) {
                    // 提交数据给后台
                    this.addArticleLabel()
                }else{
                    return 
                }
            })
            
        },
        addArticleLabel(){
            api.add(this.formData).then((result)=>{
               let {code} =result
               if(code===20000) {
                   this.$message({
                        showClose: true,
                        message: '新增成功',
                        type: 'success'
                   })
                    // 关闭对话框 并且抓取最新数据
                   this.handleClose()
               }else {
                     this.$message({
                        showClose: true,
                        message: '新增失败',
                        type: 'error'
                   })
                    this.handleClose()
               }
            })
        }
    },
    }
</script>

<style lang="scss" scoped>

</style>