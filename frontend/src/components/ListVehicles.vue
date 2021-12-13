<template>
  <div>
    <h2>Fordonsbesiktningar</h2>
    <div class="vehiclelist">
      <div v-if="loading" class="loading">Loading...</div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="vehicles">
        <table class="vehicletable">
          <thead class="tableheader">
            <tr>
              <th class="chassi">Chassi serienummer</th>
              <th class="inspection" @click="sortBy(0)">
                Senaste besiktning<span class="arrow" :class="sort[0] < 0 ? 'dsc' : 'asc'"></span>
              </th>
              <th class="inspection" @click="sortBy(1)">
                Nästa besiktning<span class="arrow" :class="sort[1] < 0 ? 'dsc' : 'asc'"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in vehicles" :key="index">
              <td class="chassi">{{ item.chassi }}</td>
              <td class="inspection">{{ item.prevInspection }}</td>
              <td class="inspection">{{ item.nextInspection }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const SORT_ORDER = {
  ASCENDING: 1,
  DESCENDING: -1,
};

export default {
  name: "ListVehicles",
  props: {
    rowData: Array, // rad-data, alltså, chassi + besiktningsdatum
  },
  async created() {
    this.loading = true;
    await this.populateInspectionList();
  },
  data() {
    return {
      loading: false,
      vehicles: null,
      error: null,
      sort: [SORT_ORDER.DESCENDING, SORT_ORDER.DESCENDING],
    };
  },
  watch: {
    $route: "populateInspectionList",
  },
  methods: {
    async populateInspectionList() {
      this.error = this.vehicles = null;
      this.loading = true;
      fetch("http://localhost:8000/api/vehicles/getInspectionList")
        .then((r) => r.json())
        .then(async (r) => {
          this.loading = false;
          this.vehicles = r.sort((a, b) => {
            if (a.nextInspection == b.nextInspection) {
              return a.prevInspection >= b.prevInspection;
            }
            return a.nextInspection < b.nextInspection;
          });
        })
        .catch(() => {
          this.vehicles = null;
          this.error = "Failed to get inspection list";
          this.loading = false;
        });
    },
    sortBy(columnIndex) {
      this.sort[columnIndex] *= -1;
      let modifier = this.sort[columnIndex];
      const SORT_FNS = [
          // sort by previous inspection
        (a, b) => {
          if (a.prevInspection == b.prevInspection) {
            return (a.nextInspection - b.nextInspection);
          }
          return (a.prevInspection - b.prevInspection) * modifier;
        },
        // sort by next inspection
        (a, b) => {
          if (a.nextInspection == b.nextInspection) {
            return a.prevInspection - b.prevInspection;
          }
          return (a.nextInspection - b.nextInspection) * modifier;
        },
      ];
      switch (this.sort[columnIndex]) {
        case SORT_ORDER.DESCENDING: {
          this.vehicles = this.vehicles.sort(SORT_FNS[columnIndex]);
        } break;
        case SORT_ORDER.ASCENDING: {
          this.vehicles = this.vehicles.sort(SORT_FNS[columnIndex]);
        } break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media (max-width:700px){
      .headerLogo h1 {
          text-align:left;
      }
  }
  @media (min-width:1000px){
    .socialmedia {
      margin-right:100px;
    }
  }
.loading {
  color: darkturquoise;
  font-weight: bold;
}
.vehicletable {
  border: solid 2px;
  width: 100%;
  min-width: 1000px;
}

.vehiclelist {
  display: flex;
  justify-content: center;
}

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

tr:hover td {
    background: #c7d4dd !important;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgb(195, 15, 15);
}

.arrow.dsc {
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid  rgb(195, 15, 15);
}

</style>
