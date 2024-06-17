<template>
  <div class="About">
    <v-container class="px-16">
      <v-row dense justify="center" align="center" style="height: 90vh">
        <v-col cols="12">
          <v-card flat class="mx-auto" color="white">
            <v-card-title
              class="justify-center d-flex flex-column blue--text text--darken-1"
            >
              <span class="display-3">
                <span class="font-weight-bold">SECDIS</span>
              </span>
              <span class="display-1">
                <span class="font-weight-bold"
                  >SISTEMA DE EVALUACIÓN Y CLASIFICACIÓN DE DISTANCIAMIENTO
                  SOCIAL</span
                >
              </span>
            </v-card-title>
            <v-card-text
              class="headline font-weight-bold blue--text text--darken-1"
            >
              <div class="justify-center flex-column d-flex text-center my-5">
                <span class="title">Autores</span>
                <span>Heiner Edwar Granados Leal</span>
                <span>Jehison Andrés Rodríguez Colón</span>
                <span>Julio Barón Velandia</span>
              </div>
              <div class="justify-center flex-column d-flex text-center">
                <span>Universidad Distrital Francisco José de Caldas</span>
                <span>Facultad de Ingeniería</span>
              </div>
              <div class="justify-center flex-column d-flex text-center my-5">
                <span>Versión 1.0</span>
                <span>Copiright © {{ new Date().getFullYear() }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped></style>
