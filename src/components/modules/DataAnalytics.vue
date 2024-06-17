<template>
  <div class="DataAnalytics">
    <v-container>
      <v-row dense justify="center">
        <v-col cols="12" md="12" lg="3" class="px-4">
          <p class="title">Datos Almacenados</p>
          <v-card flat>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="desserts"
              :search="search"
              :single-select="singleSelect"
              show-select
            />
          </v-card>
        </v-col>
        <v-divider vertical />
        <v-col cols="12" md="12" lg="8">
          <v-toolbar flat>
            <div class="d-flex flex-row mx-6 align-center">
              <v-select
                v-model="selectedFilter"
                :items="filters"
                label="Selecciona"
                item-text="value"
                item-value="key"
                multiple
                chips
                dense
                hide-details
                single-line
                style="width: 250px"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="toggle">
                    <v-list-item-action>
                      <v-icon
                        :color="
                          selectedFilter.length > 0 ? 'blue darken-1' : ''
                        "
                      >
                        {{ icon }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Select All
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.value }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text caption">
                    (+{{ selectedFilter.length - 1 }} más)
                  </span>
                </template>
              </v-select>
              <v-btn
                class="ml-2"
                outlined
                small
                elevation="0"
                color="blue darken-1"
                @click="loadDataByCameraId(currentCameraId)"
                >Aplicar filtro</v-btn
              >
            </div>
            <v-spacer />
            <v-btn
              :disabled="!otherData.offset > 0"
              small
              outlined
              elevation="0"
              color="blue darken-1"
              @click="loadDataByCameraId(currentCameraId, false)"
            >
              <v-icon left>
                mdi-chevron-left
              </v-icon>
              Anteriores
            </v-btn>
            <v-btn
              class="ml-2"
              :disabled="otherData.offset >= otherData.count - otherData.limit"
              small
              outlined
              elevation="0"
              color="blue darken-1"
              @click="loadDataByCameraId(currentCameraId, true)"
            >
              siguientes
              <v-icon right>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </v-toolbar>
          <div class="d-flex flex-row mx-10 justify-md-space-between my-2">
            <span class="subtitle-1 font-weight-bold">
              Cantidad total de registros: {{ otherData.count }}
            </span>
            <div class="d-flex flex-row">
              <span class="subtitle-1 font-weight-bold">
                Registros mostrados: {{ otherData.offset }} -
                {{ otherData.limit + otherData.offset }}
              </span>
            </div>
          </div>
          <v-row dense class="px-10">
            <v-col cols="12" md="12">
              <StaticLineChart
                :chart-data="dataCollection"
                :options="options"
              />
            </v-col>
          </v-row>
          <v-divider />
          <v-row dense class="px-5" align="center" justify="center">
            <v-col
              cols="12"
              md="12"
              class="d-flex flex-row justify-md-space-between my-10"
            >
              <template v-for="(d, dIndex) in dataCollection.datasets">
                <CardAnalytics
                  :key="dIndex"
                  :card="d"
                  :date="dataCollection.labels"
                  :response="detections"
                />
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { pythonService } from "@/services";
import StaticLineChart from "@/components/common/StaticLineChart";
import moment from "moment";
import CardAnalytics from "@/components/common/CardAnalytics";

export default {
  name: "DataAnalytics",
  data: () => ({
    headers: [
      { text: "Id", value: "id" },
      { text: "Cámara", value: "name" },
      { text: "Fecha de captura", value: "capture_date" }
    ],
    desserts: [],
    search: null,
    singleSelect: true,
    selected: [],
    options: {
      maintainAspectRatio: false,
      plugins: {
        streaming: false
      },
      scales: {
        xAxes: [
          {
            type: "time",
            distribution: "series",
            offset: true,
            ticks: {
              source: "data",
              autoSkip: true,
              sampleSize: 100
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              drawBorder: false
            },
            scaleLabel: {
              display: true,
              labelString: "Calc. Riesgo."
            }
          }
        ]
      }
    },
    dataCollection: {},
    filters: [
      { key: "high_risk_count", value: "Alto riesgo" },
      { key: "low_risk_count", value: "Bajo riesgo" },
      { key: "safe_count", value: "A salvo" }
    ],
    selectedFilter: [],
    currentCameraId: null,
    activeFilters: false,
    otherData: {
      count: 0,
      limit: 100,
      offset: 0
    },
    detections: []
  }),
  watch: {
    selectedCamera(camera) {
      this.currentCameraId = camera.id;
      this.loadDataByCameraId(camera.id);
    }
  },
  computed: {
    icon() {
      if (this.allFilter) return "mdi-close-box";
      if (this.someFilter) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    allFilter() {
      return this.selectedFilter.length === this.filters.length;
    },
    someFilter() {
      return this.selectedFilter.length > 0 && !this.allFilter;
    },
    selectedCamera() {
      return this.selected[0];
    }
  },
  mounted() {
    this.loadCameras();
    // this.fillData();
  },
  methods: {
    loadCameras() {
      let self = this;
      pythonService.getCameras().then(cameras => {
        cameras.forEach(camera => {
          const { id, name, capture_date } = camera;
          self.desserts.push({
            id,
            name,
            capture_date
          });
        });
      });
    },
    async loadDataByCameraId(id, record = null) {
      let self = this;
      const { limit, offset, count } = this.otherData;
      if (self.selectedFilter.length === 0)
        self.selectedFilter = [
          "high_risk_count",
          "low_risk_count",
          "safe_count"
        ];
      if (record !== null) {
        if (record && offset <= count - limit) {
          this.otherData.offset = offset + limit;
        } else if (!record && offset >= limit) {
          this.otherData.offset = offset - limit;
        }
      }
      const params = {
        capture_id: id,
        limit: this.otherData.limit,
        offset: this.otherData.offset
      };
      if (this.otherData.count >= this.otherData.offset) {
        await pythonService.getAllDetections(params).then(detections => {
          this.detections = self.createArrayFromChart(
            this.orderByDate(detections.results)
          );
          this.otherData.count = detections.count;
        });
      }
    },
    createArrayFromChart(data) {
      this.activeFilters = data.length > 0;
      const arrayFilter = [
        "high_risk_count",
        "low_risk_count",
        "safe_count",
        "created"
      ];
      let metrics = {
        high_risk_count: [],
        low_risk_count: [],
        safe_count: [],
        created: [],
        labels: []
      };
      data.forEach(detection => {
        for (const [dKey, dValue] of Object.entries(detection)) {
          if (arrayFilter.includes(dKey)) {
            if (dKey === "created") {
              metrics[dKey].push(moment(dValue).format());
            } else {
              metrics[dKey].push(dValue);
            }
          }
        }
      });
      metrics.labels = Array.from(
        { length: metrics.safe_count.length },
        (value, index) => index
      );
      this.fillData(metrics);
      return data;
    },
    orderByDate(arr) {
      return arr.sort((a, b) => {
        return new Date(a.processing_date) - new Date(b.processing_date);
      });
    },
    fillData(metrics) {
      let self = this;
      const filters = self.selectedFilter;
      const sendData = [];
      filters.forEach(filter => {
        sendData.push({
          ...this.labelAndColor(filter),
          ...{
            data: metrics[filter],
            fill: true,
            type: "line",
            pointRadius: 1,
            borderWidth: 2
          }
        });
      });
      this.dataCollection = {
        labels: metrics.created,
        datasets: sendData
      };
    },
    labelAndColor(key) {
      switch (key) {
        case "high_risk_count":
          return {
            label: "Riesgo Alto",
            borderColor: "#E53935",
            backgroundColor: "#FF8A8033"
          };
        case "low_risk_count":
          return {
            label: "Riesgo Bajo",
            borderColor: "#FDD835",
            backgroundColor: "#FFFF8D33"
          };
        case "safe_count":
          return {
            label: "A salvo",
            borderColor: "#43A047",
            backgroundColor: "#B9F6CA33"
          };
      }
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allFilter) {
          this.selectedFilter = [];
        } else {
          this.selectedFilter = [];
          this.filters.forEach(filter => {
            this.selectedFilter.push(filter.key);
          });
        }
      });
    }
  },
  components: {
    StaticLineChart,
    CardAnalytics
  }
};
</script>

<style scoped></style>
