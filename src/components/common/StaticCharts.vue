<script>
import { Pie, mixins } from "vue-chartjs";
export default {
  name: "StaticCharts",
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "active"],
  data() {
    return {
      dataShow: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: ["Safe", "low-risk", "high-risk"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#1B4404", "#C7AF07", "#B60B0B"],
            data: [0, 0, 0]
          }
        ]
      }
    };
  },
  watch: {
    chartData: {
      handler(newData, oldData) {
        console.log(newData, oldData);
        this.dataShow.datasets.data = newData;
        this.renderChart(this.dataShow, this.options);
        console.log(this.dataShow);
      },
      deep: true
    }
  },
  mounted() {
    this.renderChart(this.dataShow, {
      responsive: true,
      maintainAspectRadio: false
    });
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
  },
  methods: {}
};
</script>

<style scoped></style>
