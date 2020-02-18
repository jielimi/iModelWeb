<template>
    <div>
        <i class="iconfont icon-celiang measure" @click.self="open">
            <div v-show="isShowDetail" class="detail" >
                <el-form label-width="100px">
                    <el-form-item label="Measure Type:">
                        <el-select v-model="type" size="mini">
                            <el-option v-for="item in measureType" :label="item.name" :key="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button size="mini" type="primary" @click="confirm">Confirm</el-button>
                    <el-button size="mini" type="primary" @click="clear">Clear</el-button>
                </div>
            </div>
        </i>
    </div>
</template>

<script>
import {
  SelectionTool,
  IModelApp,
  MeasureAreaByPointsTool,
  MeasureAreaTool,
  MeasureDistanceTool,
  MeasureLengthTool,
  MeasureLocationTool,
  MeasureVolumeTool
} from "@bentley/imodeljs-frontend";
export default {
    name: 'measure',
    data () {
        return {
            isShowDetail:false,
            measureType:[{name:"Distance",value:MeasureDistanceTool.toolId},
            {name:"Area By Points",value:MeasureAreaByPointsTool.toolId},
            {name:"Location",value: MeasureLocationTool.toolId},
            {name:"Length",value:MeasureLengthTool.toolId},
            {name:"Area",value:MeasureAreaTool.toolId},
            {name:"Volume",value:MeasureVolumeTool.toolId},
            ],
            type:MeasureDistanceTool.toolId
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        open(){
            this.isShowDetail = !this.isShowDetail;
        },
        clear(){
            IModelApp.tools.run(SelectionTool.toolId);
        },
        confirm(){
            IModelApp.tools.run(this.type, IModelApp.viewManager.selectedView)
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.measure{
    position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 38px;
            z-index: 999;
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
        }
}

</style>