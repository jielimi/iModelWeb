<template>
    <div>
        <i class="iconfont icon-qingxitouming" @click="shadow"></i>
    </div>
</template>

<script>

import {ColorDef,ColorByName} from "@bentley/imodeljs-common";
import {EmphasizeElements} from "@bentley/imodeljs-frontend";
export default {
    name: 'zoomin',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        shadow(){
            let vp = GLOBAL_DATA.theViewPort
            const emph = EmphasizeElements.getOrCreate(vp);
            if (emph.overrideSelectedElements(vp, new ColorDef(ColorByName.orange), undefined, true, false) // replace existing; don't clear selection set...
                && emph.emphasizeSelectedElements(vp, undefined, true)) { // ...replace existing; now clear selection set
                vp.isFadeOutActive = true;
            } else {
                EmphasizeElements.clear(vp); // clear any previous overrides
                vp.isFadeOutActive = false;
            }
            
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>