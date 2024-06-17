<template>
  <div class="CardAnalytics">
    <v-card width="300">
      <v-list :dark="card.label !== 'Riesgo Bajo'" :color="card.borderColor">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ card.label }}</v-list-item-title>
            <v-list-item-subtitle>Detección más alta</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content class="text-right">
            <v-list-item-title class="display-1">{{
              cardData.count
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item @click="() => {}">
          <v-list-item-action>
            <v-icon>mdi-calendar-range</v-icon>
          </v-list-item-action>
          <v-list-item-subtitle>{{ cardData.date }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "CardAnalytics",
  props: ["card", "date", "response"],
  data: () => ({}),
  computed: {
    cardData() {
      return this.createObjectArray(this.card.data, this.date);
    }
  },
  mounted() {
    console.log(this.response);
  },
  methods: {
    determineHighValue(data) {
      const cloneData = [...data];
      const sort = cloneData.sort((a, b) => {
        return b.count - a.count;
      });
      return sort[0];
    },
    createObjectArray(data, labels) {
      const newData = [];
      data.forEach(d => {
        newData.push({
          count: d,
          date: moment(labels[d]).format("YYYY/MM/DD hh:mm:ss A")
        });
      });
      return this.determineHighValue(newData);
    }
  }
};
</script>

<style scoped></style>
