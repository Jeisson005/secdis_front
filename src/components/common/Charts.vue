<script>
import { Line } from "vue-chartjs";
import "chartjs-plugin-streaming";
export default {
  props: ["dataset", "datasetAlone", "pause", "option", "idCamera"],
  extends: Line,
  name: "Chart",
  data() {
    return {
      activeGraph: false
    };
  },
  watch: {
    pause(val) {
      this.activeGraph = val;
    }
  },
  mounted() {
    if (this.option === "allCameras") {
      this.allCameras();
    }
    if (this.option === "aloneCamera") {
      this.aloneCamera();
    }
  },
  methods: {
    allCameras() {
      let self = this;
      this.renderChart(
        {
          datasets: [
            {
              label: "A salvo",
              borderColor: "rgb(76,175,80)",
              backgroundColor: "rgba(98, 0, 234, 0.5)",
              fill: false
            },
            {
              label: "Riesgo bajo",
              borderColor: "rgb(251,192,45)",
              backgroundColor: "rgba(98, 0, 234, 0.5)",
              fill: false
            },
            {
              label: "Riesgo alto",
              borderColor: "rgb(244,67,54)",
              backgroundColor: "rgba(98, 0, 234, 0.5)",
              fill: false
            },
            {
              label: "Personas detectadas",
              borderColor: "rgb(30, 136, 229)",
              backgroundColor: "rgba(98, 0, 234, 0.5)",
              fill: false
            }
          ]
        },
        {
          scales: {
            xAxes: [
              {
                type: "realtime",
                realtime: {
                  duration: 30000,
                  pause: self.activeGraph,
                  onRefresh: function(chart) {
                    chart.config.options.scales.xAxes[0].realtime.pause =
                      self.activeGraph;
                    chart.data.datasets.forEach(function(dataset, i) {
                      dataset.data.push({
                        x: Date.now(),
                        y: self.dataset[i]
                      });
                    });
                  },
                  delay: 2000
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 10,
                  stepSize: 1,
                  reverse: false,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: "Cámara"
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false
        }
      );
    },
    aloneCamera() {
      let self = this;
      this.renderChart(
        {
          datasets: [
            {
              label: "Normal",
              borderColor: "rgb(76, 175, 80)",
              backgroundColor: "rgba(76, 175, 80, 0.5)",
              fill: false
            },
            {
              label: "Peligro ",
              borderColor: "rgb(244, 67, 54)",
              backgroundColor: "rgba(244, 67, 54, 0.5)",
              fill: false
            }
          ]
        },
        {
          scales: {
            xAxes: [
              {
                type: "realtime",
                realtime: {
                  duration: 30000,
                  pause: self.activeGraph,
                  onRefresh: function(chart) {
                    chart.config.options.scales.xAxes[0].realtime.pause =
                      self.activeGraph;
                    chart.data.datasets.forEach(function(dataset) {
                      dataset.data.push({
                        x: Date.now(),
                        y: self.dataset[self.idCamera]
                      });
                    });
                  },
                  delay: 2000
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 10,
                  stepSize: 1,
                  reverse: false,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: "Camara " + self.idCamera
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false
        }
      );
    }
  }
};
</script>

<style scoped></style>
