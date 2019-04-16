<template>
    <div>
        <i class="iconfont icon-mark" @click="mark">
        </i>
    </div>
</template>

<script>
import { IModelApp ,SnapMode} from "@bentley/imodeljs-frontend";
import { AccuSnap } from "../../dependency/AccuSnap";
import { NotificationManager } from "../../dependency/NotificationManager";
import { MarkTool } from "../../dependency/MarkTool";


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
    },
    methods: {
        mark() {
            //IModelApp.accuSnap.enableSnap(true);
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
                    console.log("onstartup")
                    const markToolNamespace = IModelApp.i18n.registerNamespace(MarkTool.toolId);
                    MarkTool.register(markToolNamespace);
                }

                static setActiveSnapModes(snaps) {
                    IModelApp.accuSnap.setActiveSnapModes(snaps);
                }

                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }

           // MarkIModelApp.startup();
           
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>