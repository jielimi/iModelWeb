<template>
    <div>
        <i class="iconfont icon-mark" @click="mark">
        </i>
    </div>
</template>

<script>
import { IModelApp ,SnapMode,TileAdmin} from "@bentley/imodeljs-frontend";
import { AccuSnap } from "../../dependency/AccuSnap";
import { NotificationManager } from "../../dependency/NotificationManager";
import { MarkTool } from "@bentley/imodeljs-frontend/lib/tools/iModelWeb/iModelWebMark";
//import { MarkTool } from "../../dependency/markTool";
import {PrimitiveTool} from "@bentley/imodeljs-frontend"

export default {
    name: 'imodelmark',
    data () {
        return {
            
        };
    },
    components: {
        
    },
    created () {
        this.markStartup();
        // class marktest extends PrimitiveTool{

        // }
        // var test = new marktest()
    },
    methods: {
        mark() {
            IModelApp.tools.run("iModelWeb.Mark")
        },
        markStartup(){
            let that = this;
            class DisplayTestAppAccuSnap extends AccuSnap {
                    constructor() {
                        super(...arguments);
                        this._activeSnaps =  [SnapMode.NearestKeypoint];
                    }
                    keypointDivisor() { return 2; }
                    getActiveSnapModes() { 
                        return this._activeSnaps; 
                    }
                    setActiveSnapModes(snaps) {
                        this._activeSnaps.length = snaps.length;
                        for (let i = 0; i < snaps.length; i++)
                        this._activeSnaps[i] = snaps[i];
                    }
            }

            class MarkIModelApp extends IModelApp {
                static onStartup() {
                    IModelApp.accuSnap = new DisplayTestAppAccuSnap();
                    IModelApp.tileAdmin = TileAdmin.create({
                        retryInterval: 50,
                        enableInstancing: true,
                        elideEmptyChildContentRequests: true,
                    });
                    console.log("onstartup")
                    const markToolNamespace = IModelApp.i18n.registerNamespace("iModelWeb");

                    MarkTool.register(markToolNamespace);
                }

                static setActiveSnapModes(snaps) {
                    IModelApp.accuSnap.setActiveSnapModes(snaps);
                }

                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }

           MarkIModelApp.startup();
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>