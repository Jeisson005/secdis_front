<template>
  <div class="SocialDistance">
    <v-toolbar dense flat>
      <v-btn
        small
        outlined
        color="blue darken-1"
        @click="(cameraSettings = true), (activeCameraSettings = true)"
      >
        <v-icon left>mdi-application-cog</v-icon>
        Agregar Cámara
      </v-btn>
      <v-spacer />
      <v-btn
        small
        color="blue darken-1"
        :dark="detection.isActive"
        :disabled="!detection.isActive"
        elevation="0"
        @click="startRealTime"
        >Iniciar detección
      </v-btn>
      <v-btn
        small
        class="ml-2"
        :dark="!detection.isActive"
        :disabled="detection.isActive"
        color="blue darken-1"
        elevation="0"
        @click="stopBroadcast"
        >Detener detección
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-row dense align="center" justify="center">
        <v-col cols="12" md="12" lg="6" class="px-5">
          <v-tabs v-model="tab" color="blue darken-1" class="pb-2">
            <v-tab
              v-for="(t, tIndex) in tabs"
              :key="t"
              @click="tabChange(tIndex)"
              >{{ t }}</v-tab
            >
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, index) in tabs" :key="index">
              <template v-if="index === 0">
                <l-map
                  :zoom="zoom"
                  :center="center"
                  style="height: 50vh; width: 100%"
                >
                  <l-tile-layer :url="url" :attribution="attribution" />
                  <template v-for="(m, mIndex) in markerView">
                    {{ m }}
                    <l-marker
                      :key="mIndex"
                      :lat-lng="m"
                      :icon="icon[mIndex]"
                      @click="innerClick(mIndex)"
                    >
                    </l-marker>
                  </template>
                  <l-icon-default :image-path="path" />
                </l-map>
              </template>
              <template v-if="index === 1">
                <v-card style="height: 52vh" flat>
                  <v-card-text>
                    <div class="row align-center justify-center">
                      <img
                        class="rotate-img"
                        id="socketBird"
                        style="height: 50vh"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="12" lg="5" class="px-5">
          <div class="text-center" v-if="false">
            <v-btn
              v-if="pause"
              class="ma-2"
              color="deep-purple accent-4"
              rounded
              :disabled="!url"
              :dark="url !== null"
              @click="startRealTime"
              >Iniciar tiempo real
            </v-btn>
            <v-btn
              v-else
              class="ma-2"
              color="deep-purple accent-4"
              rounded
              :disabled="!url"
              :dark="url !== null"
              @click="stopBroadcast"
              >Detener tiempo real
            </v-btn>
          </div>
          <p class="title text-center">Grafíca de Riesgo</p>
          <template>
            <div>
              <chart
                :dataset="graph"
                :pause="detection.isActive"
                option="allCameras"
              />
              <static-chart
                v-if="false"
                :chart-data="graph"
                :active="countGraph"
              ></static-chart>
            </div>
          </template>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <v-row dense>
        <v-col cols="12" md="12">
          <v-container>
            <p class="title">Cámaras Almacenadas</p>
            <div style="height: 40vh; width: 100%; overflow: auto">
              <v-data-table
                v-model="cameraSelected"
                :headers="headers"
                :items="desserts"
                show-select
                single-select
              >
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getColor(item.count, item.high_risk_count)"
                    dark
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editCamera(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small class="mr-2" @click="innerClick(item)">
                    mdi-eye
                  </v-icon>
                </template>
              </v-data-table>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="z-index: 99999999"
    >
      <v-card tile>
        <v-toolbar flat dark color="blue darken-1">
          <v-toolbar-title>Información {{ cameraIndex }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row align="center" justify="center" dense>
            <v-col class="mx-5" cols="12" md="12" lg="6">
              <div class="row align-center justify-center">
                <img
                  class="mx-auto"
                  style="-webkit-user-select: none;margin: auto;"
                  id="socketImage"
                />
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="mx-5" cols="12" md="12" lg="5">
              <v-row>
                <v-container>
                  <p class="title">Información del dispositivo</p>
                  <template
                    v-for="(current, currentIndex) in listCameras[
                      cameraCurrentIndex
                    ]"
                  >
                    <p
                      v-if="
                        ![
                          'id',
                          'points',
                          'is_removed',
                          'calibr_image_name',
                          'created',
                          'modified',
                          'image_size',
                          'other'
                        ].includes(currentIndex)
                      "
                      class="text-break"
                      :key="currentIndex"
                    >
                      <span class="font-weight-bold">{{ currentIndex }}:</span>
                      {{ current }}
                    </p>
                  </template>
                </v-container>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-container>
                  <p class="title">Riesgo</p>
                  <v-simple-table dark dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            Estado
                          </th>
                          <th class="text-left">
                            Conteo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in statusDetect"
                          :key="item.name"
                          :class="colorRisk(item.id)"
                        >
                          <td class="subtitle-1">{{ item.name }}</td>
                          <td class="subtitle-1">{{ item.count }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-container>
              </v-row>
            </v-col>
          </v-row>
          <v-divider />
          <v-row v-if="false">
            <v-col cols="12">
              <v-row>
                <v-container class="mx-auto">
                  <p class="title">Linea de tiempo personas en riesgo</p>
                  <p>Fecha: {{ formatDate(new Date()) }}</p>
                  <v-timeline
                    align-top
                    dense
                    style="height: 60vh; overflow-y: auto"
                  >
                    <template v-for="(t, tIndex) in timeLine">
                      <v-timeline-item
                        :key="tIndex"
                        small
                        color="#B60B0B"
                        v-if="t.count > 0"
                      >
                        <v-row class="pt-1">
                          <v-col cols="4">
                            <strong>{{ formatTime(t.time) }}</strong>
                          </v-col>
                          <v-col>
                            <strong
                              >cantidad
                              <span class="text-decoration-underline">{{
                                t.count
                              }}</span></strong
                            >
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                    </template>
                  </v-timeline>
                </v-container>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      style="z-index: 99999999"
      v-model="cameraSettings"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <camera-settings
        v-if="activeCameraSettings"
        :updateCamera="infoCamera"
        @closeDialog="closeDialog"
        @updateListCameras="updateListCamera"
        @size="sizeDialog"
      ></camera-settings>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      Cámara no seleccionada
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue darken-1"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LIconDefault } from "vue2-leaflet";
import { pythonService } from "@/services";
import Charts from "@/components/common/Charts";
import CameraSettings from "@/components/common/CameraSettings";
import moment from "moment";
import StaticCharts from "@/components/common/StaticCharts";
import { mapState } from "vuex";

export default {
  name: "SocialDistance",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIconDefault,
    chart: Charts,
    "static-chart": StaticCharts,
    "camera-settings": CameraSettings
  },
  data() {
    return {
      zoom: 15,
      path: "../../assets/logo.png",
      center: [4.619286, -74.183503],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [],
      icon: [],
      address: [],
      desserts: [],
      headers: [
        { text: "id", value: "id" },
        { text: "Cámara", value: "name" },
        { text: "Dirección", value: "address" },
        { text: "Objetos detectados", value: "count" },
        { text: "Riesgo alto", value: "high_risk_count" },
        { text: "Riesgo bajo", value: "low_risk_count" },
        { text: "A salvo", value: "safe_count" },
        { text: "Estado", value: "status" },
        { text: "Acciones", value: "actions", sortable: false }
      ],
      statusDetect: [
        { id: 0, name: "safe", count: 0 },
        { id: 1, name: "low risk", count: 0 },
        { id: 2, name: "high risk", count: 0 }
      ],
      tab: null,
      tabs: ["Exterior", "Interior"],
      graph: 0,
      sendData: 0,
      camera: false,
      cameraIndex: 0,
      dialog: false,
      pause: true,
      timer: null,
      idCamera: 0,
      datasetStatus: [],
      videoData: [],
      urlVideo: "",
      socket: null,
      frame: null,
      bird: null,
      cameraSettings: false,
      listCameras: [],
      infoCamera: {},
      activeUpdate: false,
      activeCameraSettings: false,
      countPersons: 0,
      cameraSelected: [],
      modalSize: {},
      cameraCurrentIndex: 0,
      timeLine: [],
      countGraph: 0,
      snackbar: false
    };
  },
  computed: {
    markerView() {
      return this.marker;
    },
    ...mapState(["detection"])
  },
  sockets: {
    connect: function() {
      console.log("socket connect");
    },
    response_detect_test(msg) {
      console.log(msg);
    },
    my_response(msg) {
      let self = this;
      let other = msg.other;
      self.graph = [
        other.safe_count,
        other.low_risk_count,
        other.high_risk_count,
        msg.count
      ];
      self.countGraph = self.countGraph + 1;
      for (let sD in self.statusDetect) {
        self.statusDetect[sD].count = self.graph[sD];
      }
      self.timeLine.unshift({
        time: new Date(),
        count: other.high_risk_count
      });
      self.countPersons = msg.count;
      self.icon = [];
      self.camStatus(other, msg.count, msg.data.capture_id);
      if (self.frame !== null) {
        if (msg.image !== undefined) {
          self.frame.src = msg.image;
        }
      }
      if (self.bird !== null) {
        if (msg.image_bird !== undefined) {
          self.bird.src = msg.image_bird;
        }
      }
    }
  },
  mounted() {
    this.urlVideo = `${process.env.VUE_APP_DETECT_URL}/detections/streaming_with_detection/`;
    this.loadCameras();
    if (this.$route.path === "/analytics") {
      // this.querySimulate();
    }
  },
  methods: {
    getColor(count, high_risk_count) {
      return high_risk_count >= Math.round(count / 2) ? "red" : "green";
    },
    innerClick(index) {
      if (typeof index === "object")
        index = this.listCameras.findIndex(lC => lC.id === index.id);
      let self = this;
      self.dialog = true;
      self.cameraIndex = this.listCameras[index].name;
      setTimeout(() => {
        self.frame = document.getElementById("socketImage");
      }, 1000);
    },
    camStatus(data, count, id) {
      // let number = this.countPersons
      const { safe_count, low_risk_count, high_risk_count } = data;
      this.icon.push(
        icon({
          iconUrl:
            high_risk_count >= Math.round(count / 2)
              ? "https://don-g.com/wp-content/uploads/2020/02/circulo-rojo-png-4.png"
              : "https://upload.wikimedia.org/wikipedia/commons/2/27/Circulo_verde.png",
          iconSize: [25, 25],
          iconAnchor: [16, 37]
        })
      );
      this.desserts.forEach(d => {
        if (d.id === id) {
          d.status =
            high_risk_count >= Math.round(count / 2) ? "Peligro" : "Normal";
          d.safe_count = safe_count;
          d.low_risk_count = low_risk_count;
          d.high_risk_count = high_risk_count;
          d.count = count;
        }
      });
    },
    startRealTime() {
      let self = this;
      self.$socket.connect();
      // this.connectBroadcast();
      if (Object.entries(this.cameraSelected).length > 0) {
        self.cameraCurrentIndex = self.listCameras.findIndex(
          lC => lC.id === self.cameraSelected[0]["id"]
        );
        // self.pause = false;
        self.$store.dispatch("detection/activeDetection", false);
        self.$socket.emit("full_detection", {
          data: {
            status: "Activate",
            capture_id: this.cameraSelected[0]["id"]
          }
        });
        return false;
      } else {
        this.snackbar = true;
        alert("Cámara no seleccionada");
      }
    },
    stopRealTIme() {
      let self = this;
      // self.pause = true;
      self.$store.dispatch("detection/activeDetection", true);
      // self.socket.emit("disconnect", { data: "Disconnect" });
      self.$socket.emit("my_broadcast_event", {
        data: {
          status: "Activate",
          capture_id: this.cameraSelected[0]["id"]
        }
      });
      clearInterval(this.timer);
    },
    querySimulate() {
      pythonService.detections().then(response => {
        let video = response.filter(
          r => Object.entries(r.detection_by_label).length > 0
        );
        this.videoData = video[1].detection_by_label;
      });
    },
    connectSocket() {
      let self = this;
      self.$socket.on("connect", () => {
        self.$socket.emit("my_event", {
          data: "connected to the SocketServer"
        });
      });
    },
    connectBroadcast() {
      let self = this;
      self.$socket.emit("my_broadcast_event", {
        data: "Activate"
      });
      return false;
    },
    stopBroadcast() {
      let self = this;
      self.$store.dispatch("detection/activeDetection", true);
      self.$socket.emit("disconnect_request", {
        data: {
          status: "disconnect"
        }
      });
      return false;
    },
    closeDialog(value) {
      this.cameraSettings = value;
      this.activeCameraSettings = false;
      this.infoCamera = null;
    },
    loadCameras() {
      this.listCameras = [];
      pythonService.getCameras().then(cameras => {
        this.listCameras = cameras;
        for (let i of cameras) {
          if (i.latitude !== "" && i.longitude !== "") {
            this.marker.push(latLng(i.latitude, i.longitude));
            this.icon.push(
              icon({
                iconUrl:
                  "https://upload.wikimedia.org/wikipedia/commons/2/27/Circulo_verde.png",
                iconSize: [25, 25],
                iconAnchor: [16, 37]
              })
            );
            pythonService
              .getAddress({ lat: i.latitude, lng: i.longitude })
              .then(response => {
                this.desserts.push({
                  id: i.id,
                  name: i.name,
                  address: response.display_name,
                  status: "Normal"
                });
              });
          }
        }
        this.listCameras = cameras;
      });
    },
    editCamera(obj) {
      this.activeCameraSettings = true;
      this.infoCamera = this.listCameras.find(c => c.id === obj.id);
      this.activeUpdate = true;
      this.cameraSettings = true;
    },
    updateListCamera(flag) {
      this.desserts = [];
      this.marker = [];
      if (flag) {
        this.loadCameras();
      }
    },
    sizeDialog(obj) {
      if (obj !== undefined) {
        this.modalSize = obj;
      } else {
        this.modalSize = {
          w: 680,
          h: 800
        };
      }
    },
    tabChange(index) {
      if (index === 1)
        setTimeout(() => {
          this.bird = document.getElementById("socketBird");
        }, 1000);
    },
    colorRisk(id) {
      let classColor = "";
      switch (id) {
        case 0:
          classColor = "safe";
          break;
        case 1:
          classColor = "low-risk";
          break;
        case 2:
          classColor = "high-risk";
          break;
      }
      return classColor;
    },
    formatTime(date) {
      return moment(date).format("HH:mm:ss");
    },
    formatDate(date) {
      return moment(date).format("LL");
    }
  }
};
</script>

<style scoped lang="scss">
.safe {
  background: rgb(76, 175, 80);
}
.low-risk {
  background: rgb(251, 192, 45);
}
.high-risk {
  background: rgb(244, 67, 54);
}
</style>
