<template>
  <div class="objectDetect">
    <v-container>
      <p class="text-xl-h4">Detección de objetos</p>
      <template>
        <v-row>
          <v-col class="col-6" style="height: 85vh">
            <v-tabs v-model="tab" color="#6200EA">
              <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item v-for="(item, index) in items" :key="index">
                <v-card flat v-if="index === 0">
                  <v-row>
                    <v-col class="pt-4 pb-8">
                      <div>
                        <template>
                          <v-file-input
                            v-model="image"
                            @change="previewImage"
                            color="deep-purple accent-4"
                            counter
                            label="Archivo de imagen"
                            placeholder="Selecciona tu imagen"
                            prepend-icon="md-image"
                            outlined
                            :show-size="1000"
                            @click:clear="clearImage"
                          >
                          </v-file-input>
                          <p class="title text-center">
                            Procesamiento de imágenes (Modelo actual
                            {{ baseModel.model }})
                          </p>
                          <div v-show="!process">
                            <div ref="content-img">
                              <v-img
                                :src="url"
                                style="height: 400px;"
                                contain
                                ref="img"
                                class="mx-auto"
                              ></v-img>
                            </div>
                          </div>
                          <div v-show="process">
                            <v-card
                              class="mx-auto"
                              max-width="400"
                              flat
                              v-show="!responseProcess"
                            >
                              <v-container style="height: 600px;">
                                <v-row
                                  class="fill-height"
                                  align-content="center"
                                  justify="center"
                                >
                                  <v-col
                                    class="subtitle-1 text-center"
                                    cols="12"
                                  >
                                    <span class="title font-weight-light">{{
                                      processText
                                    }}</span>
                                  </v-col>
                                  <v-col cols="8">
                                    <v-progress-linear
                                      color="deep-purple accent-4"
                                      indeterminate
                                      rounded
                                      height="6"
                                    ></v-progress-linear>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card>
                            <v-container>
                              <canvas id="detectArea" height="400"></canvas>
                              <BoundBox
                                v-if="false"
                                b-top="152.2252693772316"
                                b-left="71.83712720870972"
                                b-height="326.6182065010071"
                                b-width="163.91418427228928"
                              />
                            </v-container>
                          </div>
                          <div class="text-center pt-4">
                            <v-btn
                              class="ma-2"
                              color="deep-purple accent-4"
                              rounded
                              :disabled="!url"
                              :dark="url !== null"
                              @click="processImage"
                              >Procesar imagen</v-btn
                            >
                          </div>
                        </template>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card flat v-if="index === 2">
                  <p class="title text-center pt-12">
                    Procesamiento en tiempo real (Modelo actual
                    {{ baseModel.model }})
                  </p>
                  <div class="text-center">
                    <v-btn
                      class="ma-2"
                      color="deep-purple accent-4"
                      rounded
                      dark
                      @click="cameraIP"
                      >{{ !activeCameraIP ? "Iniciar" : "Detener" }} cámara
                      IP</v-btn
                    >
                  </div>
                  <div v-show="activeCameraIP">
                    <canvas id="video-canvas" ref="v-canvas"></canvas>
                    <canvas
                      v-show="startPrediction"
                      class="canvas-copy"
                      id="test"
                      :height="canvasIPConfig.height"
                      :width="canvasIPConfig.width"
                    ></canvas>
                    <div class="text-center pt-4">
                      <v-btn
                        class="ma-2"
                        color="deep-purple accent-4"
                        rounded
                        :disabled="!activeCameraIP"
                        :dark="activeCameraIP"
                        @click="processDetectVideo"
                        >Procesar tiempo real</v-btn
                      >
                    </div>
                  </div>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col>
            <p class="title text-center">Configuraciones</p>
            <v-row>
              <v-col cols="5">
                <v-subheader class="py-10">
                  ¿Usar otro modelo?
                </v-subheader>
                <v-subheader class="py-8">
                  ¿Quieres limitar las clases?
                </v-subheader>
              </v-col>
              <v-col cols="7">
                <v-select
                  v-model="baseModel"
                  :items="selectableModels"
                  item-text="model"
                  item-value="key"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                  color="deep-purple accent-4"
                  @change="downloadModel"
                ></v-select>
                <v-select
                  v-model="class_value"
                  :items="classes"
                  item-text="model"
                  multiple
                  chips
                  item-value="key"
                  label="Selección de clases"
                  persistent-hint
                  color="deep-purple accent-4"
                ></v-select>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <div
                style="height: 60vh; overflow-y: auto; width: 100%"
                class="pa-12 text-center"
              >
                <template>
                  <p class="title pt-2">Información de la detección</p>
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="desserts"
                  ></v-data-table>
                </template>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </template>
      <template>
        <span class="subtitle-1 font-weight-bold">{{
          download ? "Descargando Modelo ..." : "Modelo listo para usar"
        }}</span>
        <v-progress-linear
          :indeterminate="download"
          color="deep-purple accent-4"
        ></v-progress-linear>
      </template>
    </v-container>
  </div>
</template>

<script>
import BoundBox from "@/components/common/BoundBox";

export default {
  name: "objectDetect",
  data() {
    return {
      url: null,
      image: null,
      tab: null,
      process: false,
      processText: "Descargando modelo",
      current: null,
      responseProcess: false,
      items: ["Imagen", "Video", "Tiempo real - Cámara IP"],
      desserts: [],
      headers: [
        { text: "# Id", value: "id" },
        { text: "Clase", value: "class" },
        { text: "Probabilidad (0.0 a 1.0)", value: "prob" },
        { text: "Distancia px", value: "distance" }
      ],
      width: 0,
      baseModel: { model: "lite_mobilenet_v2", key: "lmv2" },
      selectableModels: [
        { model: "lite_mobilenet_v2", key: "lmv2" },
        { model: "mobilenet_v1", key: "mv1" },
        { model: "mobilenet_v2", key: "mv2" }
      ],
      classes: ["Todas", "person"],
      class_value: ["Todas"],
      model: null,
      download: false,
      activeCameraIP: false,
      startPrediction: false,
      animationFrame: null,
      count: 0,
      canvasIPConfig: {
        height: 0,
        width: 0
      }
    };
  },
  watch: {},
  mounted() {
    // this.downloadModel();
  },
  methods: {
    previewImage() {
      this.url = URL.createObjectURL(this.image);
    },
    clearImage() {
      this.url = null;
      this.process = false;
      this.responseProcess = false;
      this.desserts = [];
    },
    processImage() {
      this.processText = "Procesando imagen";
      this.width = this.$refs["content-img"][0].clientWidth;
      this.process = true;
      let c = document.getElementById("detectArea");
      c.width = this.width;
      let ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      let img = new Image();
      img.src = this.url;
      img.height = 400;
      img.width = this.width === 0 ? 400 : this.width;
      ctx.drawImage(img, 0, 0, this.width, 400);
      this.model.detect(img).then(predictions => {
        this.responseProcess = true;
        for (let p in predictions) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#6200EA";
          ctx.rect(
            predictions[p].bbox[0],
            predictions[p].bbox[1],
            predictions[p].bbox[2],
            predictions[p].bbox[3]
          );
          ctx.fillStyle = "#6200EA";
          ctx.font = "15pt sans-serif";
          ctx.fillText(
            "Id: " + p,
            predictions[p].bbox[0] + 5,
            predictions[p].bbox[1] + 15
          );
          ctx.stroke();
          this.desserts.push({
            id: p,
            class: predictions[p].class,
            prob: predictions[p].score
          });
        }
        console.log("Predictions: ", predictions);
      });
    },
    cameraIP() {
      this.activeCameraIP = !this.activeCameraIP;
      let canvas = document.getElementById("video-canvas");
      let url = "ws://localhost:9999/";
      new window.JSMpeg.Player(url, { canvas: canvas });
    },
    startProcessVideo() {
      let video = document.getElementById("video-canvas");
      let ctx = document.getElementById("test").getContext("2d");
      ctx.clearRect(
        0,
        0,
        this.canvasIPConfig.width,
        this.canvasIPConfig.height
      );
      this.model.detect(video).then(predictions => {
        if (predictions.length) {
          let lastPosition = [];
          for (let p in predictions) {
            this.count = this.count + 1;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#6200EA";
            ctx.rect(
              predictions[p].bbox[0],
              predictions[p].bbox[1],
              predictions[p].bbox[2],
              predictions[p].bbox[3]
            );
            ctx.fillStyle = "#6200EA";
            ctx.font = "15pt sans-serif";
            ctx.fillText(
              predictions[p].class,
              predictions[p].bbox[0] + 5,
              predictions[p].bbox[1] + 15
            );
            ctx.stroke();
            lastPosition.push(predictions[p].bbox);
            let distance = 0;
            if (lastPosition.length >= 2) {
              distance = this.distanceBoundBox(
                predictions[p].bbox,
                lastPosition[p - 1]
              );
            }
            console.log(lastPosition);
            this.desserts.push({
              id: this.count,
              class: predictions[p].class,
              prob: predictions[p].score,
              distance: distance
            });
          }
          console.log(lastPosition);
        }
      });
      this.animationFrame = window.requestAnimationFrame(
        this.startProcessVideo
      );
    },
    stopProcessVideo() {
      window.cancelAnimationFrame(this.animationFrame);
      return;
    },
    processDetectVideo() {
      this.startPrediction = !this.startPrediction;
      console.log(this.startPrediction);
      if (this.startPrediction) {
        this.count = 0;
        this.startProcessVideo();
        this.canvasConfig();
      } else {
        let ctx = document.getElementById("test").getContext("2d");
        ctx.clearRect(
          0,
          0,
          this.canvasIPConfig.width,
          this.canvasIPConfig.height
        );
        this.stopProcessVideo();
      }
    },
    downloadModel() {
      this.download = true;
      this.image = null;
      this.clearImage();
      window.cocoSsd.load(this.baseModel.model).then(model => {
        this.model = model;
        this.download = false;
      });
    },
    canvasConfig() {
      this.canvasIPConfig = {
        height: this.$refs["v-canvas"][0].height,
        width: this.$refs["v-canvas"][0].width
      };
    },
    distanceBoundBox(bbox1, bbox2) {
      console.log(bbox1, bbox2);
      let x_distance = bbox1[0] - bbox2[0];
      let y_distance = bbox1[1] - bbox2[1];
      let distance = Math.sqrt(
        Math.pow(x_distance, 2) + Math.pow(y_distance, 2)
      );
      return distance;
    }
  },
  components: {
    BoundBox
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
}
.canvas-copy {
  position: absolute;
  left: 0;
}
</style>
