<template>
    <div @click="dialogVisible = true">
        <i class="iconfont icon-info"></i>
        <el-dialog
            title="Debug Info"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="Track Memory:">
                    <el-select v-model="form.memory" placeholder="" @change="memIndexChange">
                        <el-option label="None" value="-1"></el-option>
                        <el-option label="ViewportTileTrees" value="0"></el-option>
                        <el-option label="AllTileTrees" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.memory != '-1'">
                    <table border="1" style="width:100%">
                        <tr>
                            <td style="width:50%">
                                <div>
                                    <label v-for="(val,key) in form.texture">{{val}}</label>
                                </div>
                            </td>
                            <td style="width:50%">
                                <div>
                                    <label v-for="(val,key) in form.buffer">{{val}}</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%">
                                <div>
                                    <label>Total:{{form.total}}</label>
                                </div>
                            </td>
                            <td style="width:50%">
                                <div>
                                    <label>Total Tile Tree:{{form.totalTileTrees}}</label>
                                </div>
                            </td>
                            
                        </tr>

                    </table>
                </el-form-item>
            </el-form>        
        </el-dialog>
    </div>
</template>

<script>
import {
  IModelApp,
  RenderMemory,
  TileTree,
  TileTreeSet,
  Viewport,
} from "@bentley/imodeljs-frontend";
import { assert, BeTimePoint } from "@bentley/bentleyjs-core";


export default {
    name: 'debuginfo',
    data () {
        return {
            dialogVisible: false,
            form:{
                memory:'None',
                oldMemIndex:'0',
                total:'',
                totalTileTrees:'',
                texture:[],
                buffer:[]
            },
            _curIntervalId:''
        };
    },
    components: {
        
    },
    created () {},
    methods: {
         formatMemory(numBytes) {
            let suffix = "b";
            if (numBytes >= 1024) {
                numBytes /= 1024;
                suffix = "kb";
                if (numBytes >= 1024) {
                numBytes /= 1024;
                suffix = "mb";
                }
            }
            return numBytes.toFixed(2) + suffix;
        },
        collectTileTreeMemory(stats, owner) {
            const tree = owner.tileTree;
            if (undefined !== tree)
                tree.collectStatistics(stats);
        },
        clearInterval() {
            if (undefined !== this._curIntervalId) {
                clearInterval(this._curIntervalId);
                this._curIntervalId = undefined;
            }
        },
        memIndexChange(index){
            if(this.oldMemIndex == index){
                return;
            }

            if ("-1" === index) {
                this.clearInterval();
                return;
            }

            if (undefined === this._curIntervalId) {
                this._curIntervalId = setInterval(() => this.unpdate(index), 1000);
            }

            this.oldMemIndex = index;
        },
        unpdate(index){

            const calcMem = [
                (stats, vp) => {
                    vp.collectStatistics(stats);
                    const trees = new TileTreeSet();
                    vp.discloseTileTrees(trees);
                    return trees.size;
                },
                (stats, vp) => {
                    let numTrees = 0;
                    vp.view.iModel.tiles.forEachTreeOwner((owner) => {
                    this.collectTileTreeMemory(stats, owner);
                    if (undefined !== owner.tileTree)
                        ++numTrees;
                    });
                    return numTrees;
                },
            ];

            let _stats = new RenderMemory.Statistics();
            let _vp = this.GLOBAL_DATA.theViewPort;
            const calc = calcMem[index];
            _stats.clear();
            const numTrees = calc(_stats, _vp);
            this.form.total = this.formatMemory(_stats.totalBytes);
            this.form.totalTileTrees = numTrees;

            //Texture
            this.updateTexture(_stats.consumers, _stats.totalBytes - _stats.buffers.totalBytes);;
            // Buffer
            this.updateBuffer(_stats.buffers.consumers, _stats.buffers.totalBytes);
        },
        updateTexture(stats,totalBytes){
            let lables = ["Surface Textures", "Vertex Tables", "Feature Tables", 
            "Feature Overrides", "Clip Volumes", "Planar Classifiers", "Shadow Maps"]
            this.form.texture=[];
            for(let index =0;index < lables.length;index++){
                const stat = stats[index];
                if (0 === stat.totalBytes) {
                    continue;
                }else{
                    let item = lables[index] + "(" +stat.count + "): " + this.formatMemory(stat.totalBytes);
                    this.form.texture.push(item)
                }
            }
            // console.log(stats,totalBytes)
        },
        updateBuffer(stats,totalBytes){
            let lables = ["Surfaces", "Visible Edges", "Silhouettes", "Polyline Edges", 
            "Polylines", "Point Strings", "Point Clouds", "Instances"];
            this.form.buffer=[]
            for(let index =0;index < lables.length;index++){
                const stat = stats[index];
                if (0 === stat.totalBytes) {
                    continue;
                }else{
                    let item = lables[index] + "(" +stat.count + "): " + this.formatMemory(stat.totalBytes);
                    this.form.buffer.push(item)
                }
            }

            // console.log(stats,totalBytes)
        },
        opendebug(){
           
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>