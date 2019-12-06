<template>
  <div class="viewport">
    <div class="toolbar">
      <change-view-component></change-view-component>
      <div class="tool" @click="handleClick('Fit')">
        Fit
      </div>
      <div class="tool" @click="handleClick('Walk')">
        Walk
      </div>
      <div class="tool" @click="handleClick('Zoom')">
        Zoom
      </div>
      <div class="tool" @click="handleClick('Rotate')">
        Rotate
      </div>
      <div class="tool">
        <el-checkbox v-model="checked">
          <span
            :style="{ display: 'inline-block', width: '80px', margin: '0 4px' }"
          >
            {{ checked ? `FPS: ${fps}` : "Track FPS" }}
          </span></el-checkbox
        >
      </div>
    </div>
    <div class="imodel-viewport" ref="vpDiv"></div>
  </div>
</template>
<script>
import {
  FitViewTool,
  WalkViewTool,
  ZoomViewTool,
  RotateViewTool
} from "@bentley/imodeljs-frontend";

import { SimpleViewApp } from "../lib/SimpleViewApp.js";
import changeViewComponent from './components/changeView';


// import ChangeView from "../components/ChangeView.vue";

export default {
  name: "Viewport",
  components: { changeViewComponent },
  data() {
    return {
      fps: 0,
      viewSpecs: null,
      viewId: "",
      checked: false,
      timeout: null
    };
  },
  watch: {
    checked(val) {
      if (val) {
        SimpleViewApp.enableFps();
        this.timeout = setInterval(() => {
          this.fps = SimpleViewApp.fps;
        }, 500);
      } else {
        SimpleViewApp.disableFps();
        this.fps = 0;
        window.clearInterval(this.timeout);
      }
    }
  },
  mounted() {
    const version = {
      name: this.$route.query.versionName,
      projectId: this.$route.query.projectId,
      url: this.$route.query.url
    };

    this.$nextTick(() => {
      this.main(version);
    });
  },
  beforeDestroy() {
    SimpleViewApp.shutdown();
    window.clearInterval(this.timeout);
  },
  methods: {
    async main(version) {
      SimpleViewApp.startup(version.projectId, version.url);

      await SimpleViewApp.render(version, this.$refs.vpDiv);

      this.viewSpecs = JSON.parse(JSON.stringify(SimpleViewApp.viewList));
      window.eventHub.$emit('viewList_init', this.viewSpecs);

      this.viewId = SimpleViewApp.selectedViewSpec.id;
    },
    // async changeView(id) {
    //   await SimpleViewApp.changeView(id);

    //   this.viewId = SimpleViewApp.selectedViewSpec.id;
    // },
    handleClick(label) {
      switch (label) {
        case "Fit":
          SimpleViewApp.run(FitViewTool.toolId);
          break;
        case "Walk":
          SimpleViewApp.run(WalkViewTool.toolId);
          break;
        case "Zoom":
          SimpleViewApp.run(ZoomViewTool.toolId);
          break;
        case "Rotate":
          SimpleViewApp.run(RotateViewTool.toolId);
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style scoped lang="less">
.viewport {
  width: 100%;
  height: 100vh;
  padding-top: 60px;
  .toolbar {
    height: 60px;
    margin-top: -60px;
    padding-left: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tool {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      margin-right: 4px;
      padding: 10px 24px;
      cursor: pointer;
    }
  }
  .imodel-viewport {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
