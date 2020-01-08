<template>
    <div>
        <i class="iconfont icon-baocun views-save" @click.self="open">
            <div v-show="isShowDetail" class="detail" >
                <div style="padding: 10px;">
                    <el-input 
                        type="text"
                        placeholder=""
                        v-model="inputName"
                        maxlength="15"
                        show-word-limit
                        clearable
                    />
                    <div class="viewsNameGroup">
                        <el-radio-group v-model="radio">
                            <el-radio v-for="item in viewsList" :label="item.name" :key="item.name"></el-radio>                        
                        </el-radio-group>
                    </div>
                    
                    <div class="btn-group">
                        <el-button size="mini" type="primary" click="create">Create</el-button>
                        <el-button size="mini" type="primary" click="recall">Recall</el-button>
                        <el-button size="mini" type="primary" click="delete">Delete</el-button>
                    </div>
                </div>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'save',
    data () {
        return {
            isShowDetail:false,
            inputName:'',
            viewsList:[{
                name:1
            },{
                name:2
            }],
            radio: 3
        };
    },
    props:[],
    components: {
        
    },
    created () {},
    methods: {
        open(){
            this.isShowDetail = !this.isShowDetail;
        }
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.views-save{
    position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 38px;
            z-index: 999;
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-radio-group {
                display: block;
                margin-left: 15px;
            }
        }
        .viewsNameGroup{
            margin: 20px 0;
            .el-radio{
                display: block;
                color: #606266;
                font-weight: 500;
                line-height: 1;
                cursor: pointer;
                white-space: nowrap;
                outline: 0;
            }
            .el-radio+.el-radio {
                margin-top: 10px;
                margin-left: 0px;
            }
        }
}
</style>