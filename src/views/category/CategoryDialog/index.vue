<template>

        <el-dialog
            :title="title"
            :visible.sync="isShowDialog"
             width="500px"
            :before-close="handleClose">
        <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px" status-icon>
            <el-form-item prop="name"  label="分类名称:">
                <el-input style="width:300px " v-model="formData.name"> </el-input>
            </el-form-item>
            <el-form-item prop="status"  label="状态:">
                <el-radio-group v-model="formData.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="sort" label="排序:">
                <el-input-number v-model="formData.sort"  :min="1" :max="10000"  style="width:300px"></el-input-number>
            </el-form-item>
            <el-form-item  prop="remark" label="备注">
                <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>
             <el-form-item>
                 <el-button type="primary" size="mini" @click="formData.id?updateSubmit('formData'):submitForm('formData')"  :style="{marginLeft:'178px'}">确定</el-button>
                 <el-button size="mini" @click="handleClose">取消</el-button>
             </el-form-item>
               
        </el-form>
        </el-dialog>

</template>

<script>

import  api from '@/api/category'
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
               default:()=> ({
                   
               })
           },
           remoteClose:Function

        },
        data(){
            return {
                // 定义表单校验规则
                rules:{
                    name:[{required:true,message:'请输入类名',trigger:'blur'}],
                    status:[{required:true,message:'请选择状态',trigger:'change'}],
                    sort:[{required:true,message:'请选择排序',trigger:'blur'}]
                }
            }
        },

        mounted(){
            console.log(this,'弹窗组件');
        },
        methods: {
            
        // 当我们点击x关闭或者取消的时候触发 这个方法
        handleClose(){
             this.$refs.formData.resetFields()
             this.remoteClose()
            
        },
        // 新增提交表单
        submitForm(formName){
             this.$refs[formName].validate((valid) => {
          if (valid) {
            // 把数据提交到后台
             this.submitData()

          } else {
            console.log('error submit!!');
            return false;
          }
        });
        },

        async  submitData(){
          let result =  await api.add(this.formData)
            console.log(result,'result');
          if(result.code===20000) {
               this.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
               });
                // 关闭窗口
               this.handleClose()
                return false
          }

          this.$message({
                showClose: true,
                message: '新增失败',
                type: 'error'
           });
          return false

        } ,
        // 更新提交
        updateSubmit(formName){
               
            this.$refs[formName].validate((valid)=>{
                if(valid) {
                    
                // 更新之后的数据提交到后台
                    this.afterUpdatedFormSubmit()
                }else {
                    return false
                }
            })  
        },
      async  afterUpdatedFormSubmit(){
            
            let {formData} = this
            let {id} = formData
            let data ={}
            for(let key in formData) {
                if(key!=='id'&&key!=="createDate") {
                   data[key] =formData[key]
                }
                

            }
            let result=   await  api.amendSubmit(id,data)
            if(result.code===20000) {
                this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
               })
                 // 关闭对话框 并且重新抓取数据
                this.handleClose()
            }else {
                 this.$message({
                showClose: true,
                message: '修改失败',
                type: 'error'
               })
                this.handleClose()
            }

           
        }

        
        },
    }
</script>

<style lang="scss" scoped>

</style>