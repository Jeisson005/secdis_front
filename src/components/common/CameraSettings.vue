<template>
  <div class="SocialDistancing">
    <v-card tile>
      <v-toolbar dark color="blue darken-1">
        <v-toolbar-title>Configuración de la cámara</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card
        class="d-flex justify-center"
        style="min-height: 93vh; height: auto"
      >
        <v-container class="pt-16">
          <v-row align="center" justify="center">
            <v-col cols="12" md="12" lg="4" class="mx-2">
              <div class="text-center">
                <v-row dense>
                  <v-col v-if="updateCam">
                    <v-text-field
                      color="blue darken-1"
                      v-model="cameraSettings.id"
                      label="Id de la cámara a actualizar"
                      placeholder="Agrega el id de tu cámara aquí"
                      outlined
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      color="blue darken-1"
                      v-model="cameraSettings.name"
                      label="Nombre cámara"
                      placeholder="Agrega el nombre de tu cámara aquí"
                      outlined
                    />
                  </v-col>
                </v-row>
                <v-text-field
                  color="blue darken-1"
                  v-model="cameraSettings.ip"
                  label="IP de la cámara"
                  placeholder="Agrega la IP de tu cámara (http:// o rstp://)"
                  outlined
                />
                <v-row>
                  <v-col>
                    <v-text-field
                      color="blue darken-1"
                      v-model="cameraSettings.coordinates.lat"
                      label="Geolocalización de la cámara (Latitud)"
                      placeholder="Añade aquí la ubicación de latitud de tu cámara"
                      outlined
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      color="blue darken-1"
                      v-model="cameraSettings.coordinates.lng"
                      label="Geolocalización de la cámara (Longitud)"
                      placeholder="Añade aquí la ubicación de longitud de tu cámara"
                      outlined
                    />
                  </v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col>
                    <v-select
                      v-model="cameraSettings.filter_labels"
                      color="blue darken-1"
                      label="Clases a detectar"
                      placeholder="Añade aquí la ubicación de longitud de tu cámara"
                      outlined
                      :items="labels"
                      item-value="id"
                      item-text="name"
                      multiple
                    />
                  </v-col>
                </v-row>
                <v-row dense justify="center" align="center">
                  <v-col cols="6" md="6" lg="6" class="mt-8">
                    <v-text-field
                      color="blue darken-1"
                      v-model="
                        cameraSettings.dist_calibr_metric.safe_low_risk_radius
                      "
                      label="Radio Interno (cm)"
                      placeholder="Escribe aquí el radio interior en cm"
                      outlined
                    />
                    <v-text-field
                      color="blue darken-1"
                      v-model="
                        cameraSettings.dist_calibr_metric.low_high_risk_radius
                      "
                      label="Radio Externo (cm)"
                      placeholder="Escribe aquí el radio exterior en cm"
                      outlined
                    />
                  </v-col>
                  <v-col cols="6" md="6" lg="6">
                    <v-img
                      src="../../assets/images/radio_interno_externo.png"
                      max-width="230"
                      class="mx-auto"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      class="ma-2"
                      color="blue darken-1"
                      elevation="0"
                      dark
                      @click="getCameraFrame"
                      >{{ updateCam ? "Actualizar" : "Guardar" }} información
                    </v-btn>
                    <v-btn
                      v-if="updateCam"
                      class="ma-2"
                      color="blue darken-1"
                      elevation="0"
                      dark
                      text
                      @click="updateFrame"
                      >Nuevo frame
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <p
                class="caption grey--text"
                style="position:absolute; bottom: 0"
              >
                Al guardar los datos de la cámara automáticamente se cargara un
                frame validando que estemos recibiendo el streaming desde la
                cámara.
              </p>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" md="12" lg="7">
              <p class="title text-center">Calibración de la cámara</p>
              <v-container fill-height fluid class="text-center">
                <v-row align="center" justify="center">
                  <v-col v-if="cameraFrame">
                    <div class="mx-16">
                      <p class="title">{{ textLoad }}</p>
                      <v-progress-linear
                        color="blue darken-1"
                        indeterminate
                        rounded
                        height="6"
                      ></v-progress-linear>
                    </div>
                  </v-col>
                  <v-col v-show="!cameraFrame">
                    <canvas
                      class="canvas"
                      id="calibration"
                      @click="clickedMouse($event)"
                    >
                    </canvas>
                    <canvas class="canvas-copy" id="visualization"></canvas>
                  </v-col>
                </v-row>
                <div
                  class="text-center"
                  style="width: 100%"
                  v-if="!cameraFrame"
                >
                  <v-btn
                    class="ma-2"
                    color="blue darken-1"
                    dark
                    text
                    @click="clearPoints"
                    >Limpiar puntos
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    color="blue darken-1"
                    :dark="sendActive"
                    :disabled="!sendActive"
                    @click="sendPoints"
                    >Enviar puntos
                  </v-btn>
                </div>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card>
    <v-dialog v-model="okSend" max-width="290"
      ><v-card>
        <v-card-title class="headline">
          Puntos enviados.
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="okSend = false">
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Dialogs
      :open="camera.open"
      :title="camera.title"
      :description="camera.description"
      @closeSecondDialog="closeSecondDialog"
    />
  </div>
</template>

<script>
import { pythonService } from "@/services";
import Dialogs from "@/components/common/Dialogs";

export default {
  props: ["updateCamera"],
  name: "SocialDistancing",
  data() {
    return {
      cameraSettings: {
        id: "",
        name: "",
        ip: "",
        coordinates: {
          lat: "",
          lng: ""
        },
        filter_labels: [],
        dist_calibr_metric: {
          safe_low_risk_radius: "",
          low_high_risk_radius: ""
        }
      },
      cameraFrame: true,
      rectangle: [],
      points: [],
      sendData: {},
      updateCam: false,
      image: {
        height: null,
        width: null
      },
      lastId: null,
      textLoad: "Esperando Frame",
      imageConf: {
        height: "",
        width: ""
      },
      sendActive: false,
      currentlyCamera: null,
      okSend: false,
      cloneUpdateCamera: {},
      labels: [],
      camera: {
        open: false
      }
    };
  },
  mounted() {
    this.getLabels();
    this.cloneUpdateCamera =
      this.updateCamera !== null ? this.updateCamera : {};
    if (Object.entries(this.cloneUpdateCamera).length > 0) {
      this.currentlyCamera = Object.assign({}, this.updateCamera);
    }
    this.loadUpdateCamera();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
      this.heightWidth();
    },
    closeSecondDialog(dialogResponse) {
      this.camera.open = !dialogResponse;
    },
    heightWidth() {
      this.$emit("size", { h: this.imageConf.height, w: this.imageConf.width });
    },
    getCameraFrame() {
      this.textLoad = "Cargando frame. Espere por favor.";
      const {
        name,
        ip,
        coordinates,
        filter_labels,
        dist_calibr_metric
      } = this.cameraSettings;
      let body = {
        name,
        path: ip,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        capture_date: new Date(),
        points: {},
        other: {},
        multimedia_type: 1,
        filter_labels,
        dist_calibr_metric
      };
      if (this.updateCam) {
        pythonService
          .updateCamera(this.cameraSettings.id, body)
          .then(updateCamera => {
            this.lastId = updateCamera.id;
            pythonService.calibrateCamera(updateCamera.id).then(response => {
              if (response.calibr_image_path === "") {
                this.textLoad = "No se conecto la cámara";
              } else {
                this.cameraFrame = false;
                this.camera = {
                  open: true,
                  title: "Estado de la cámara",
                  description: "Cámara actualizada exitosamente"
                };
                this.$emit("updateListCameras", true);
              }
            });
          });
      } else {
        pythonService.createCamera(body).then(createCamera => {
          this.lastId = createCamera.id;
          pythonService.calibrateCamera(createCamera.id).then(response => {
            if (response.calibr_image_path === "") {
              this.textLoad = "No se conecto la cámara";
            } else {
              this.cameraFrame = false;
              this.updateFrame();
              this.$emit("updateListCameras", true);
              this.camera = {
                open: true,
                title: "Estado de la cámara",
                description: "Cámara creada exitosamente"
              };
            }
          });
        });
      }
    },
    drawPoints(width, height) {
      let canvas = document.getElementById("calibration");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");

      context.font = "16px Arial";
      context.textBaseline = "middle";
      context.fillStyle = "#000000";

      canvas.addEventListener("mouseout", function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      canvas.addEventListener("mousemove", function(e) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(e.layerX, e.layerY, 3, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
        let text = "(" + e.layerX + ", " + e.layerY + ")";
        context.fillText(text, e.layerX + 5, e.layerY);
      });
    },
    clickedMouse(e) {
      let canvas = document.getElementById("visualization");
      let context = canvas.getContext("2d");
      if (this.rectangle.length < 4) {
        this.rectangle.push({
          x: e.layerX,
          y: e.layerY
        });
        context.beginPath();
        context.arc(e.layerX, e.layerY, 2, 0, Math.PI * 2, false);
        context.lineWidth = 3;
        context.strokeStyle = "#000";
        context.stroke();
        if (this.rectangle.length === 4) {
          this.drawRectangle();
        }
      } else {
        if (this.points.length < 3) {
          this.points.push({
            x: e.layerX,
            y: e.layerY
          });
          context.beginPath();
          context.arc(e.layerX, e.layerY, 2, 0, Math.PI * 2, false);
          context.lineWidth = 3;
          context.strokeStyle = "#3D5AFE";
          context.lineTo(this.points[0].x, this.points[0].y);
          context.stroke();
          if (this.points.length === 3) {
            this.sendActive = true;
          }
        }
      }
    },
    drawRectangle() {
      let canvas = document.getElementById("visualization");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = "#6200ea";
      ctx.moveTo(this.rectangle[0].x, this.rectangle[0].y);
      for (let r of this.rectangle) {
        ctx.lineTo(r.x, r.y);
      }
      ctx.lineTo(this.rectangle[0].x, this.rectangle[0].y);
      ctx.stroke();
    },
    formatSendData() {
      let rectangle = this.rectangle;
      let points = this.points;
      let objSend = {
        rectangle: rectangle,
        points: {
          center: points[0],
          horizontal: points[1],
          vertical: points[2]
        }
      };
      this.sendData = objSend;
      pythonService
        .calibrateCamera(this.lastId, { points: objSend })
        .then(() => {
          this.camera = {
            open: true,
            title: "Estado del frame",
            description: "Puntos enviados"
          };
        });
    },
    renderImageResponse(image) {
      let self = this;
      let img = new Image();
      let canvas = document.getElementById("visualization");
      let context = canvas.getContext("2d");
      this.imageConf.width = image.image_size.width;
      this.imageConf.height = image.image_size.height;
      canvas.width = image.image_size.width;
      canvas.height = image.image_size.height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      img.src = process.env.VUE_APP_PATH_IMAGE + image.calibr_image_path;
      img.onload = function() {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        self.cameraFrame = false;
      };
      self.drawPoints(image.image_size.width, image.image_size.height);
      this.rectangle = [];
      this.points = [];
    },
    loadUpdateCamera() {
      this.currentlyCamera =
        this.currentlyCamera !== null ? this.currentlyCamera : {};
      if (Object.entries(this.currentlyCamera).length > 0) {
        this.lastId = this.currentlyCamera.id;
        this.updateCam = true;
        const {
          id,
          name,
          longitude,
          latitude,
          filter_labels,
          dist_calibr_metric
        } = this.currentlyCamera;
        this.cameraSettings = {
          id: id,
          name: name,
          ip: this.currentlyCamera.path,
          coordinates: {
            lat: latitude,
            lng: longitude
          },
          filter_labels,
          dist_calibr_metric
        };
        if (this.currentlyCamera["calibr_image_path"] !== null) {
          this.renderImageResponse(this.currentlyCamera);
          this.cameraFrame = false;
        }
      } else {
        this.updateCam = false;
      }
    },
    clearPoints() {
      let canvas = document.getElementById("visualization");
      canvas.width = this.imageConf.width;
      canvas.height = this.imageConf.height;
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, 400, 400);
      this.loadUpdateCamera();
      this.rectangle = [];
      this.points = [];
      this.sendActive = false;
    },
    sendPoints() {
      if (this.points.length === 3) {
        this.formatSendData();
      }
    },
    updateFrame() {
      pythonService.getNewFrame(this.lastId).then(response => {
        this.textLoad = "Cargando frame. Espere por favor.";
        this.cameraFrame = true;
        this.renderImageResponse(response);
        this.currentlyCamera = response;
        this.$emit("updateListCameras", true);
      });
    },
    async getLabels() {
      await pythonService.getClassesDetect().then(labels => {
        this.labels = labels;
      });
    }
  },
  components: {
    Dialogs
  }
};
</script>

<style scoped lang="scss">
.canvas {
  position: absolute;
}
.canvas-copy {
  left: 0;
}
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
