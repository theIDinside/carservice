<template>
  <div>
    <ListVehicles/>
  </div>
</template>

<script>
// @ is an alias to /src
import ListVehicles from "@/components/ListVehicles.vue";
export default {
  name: "List",
  components: {
    ListVehicles,
  },
};
</script>
