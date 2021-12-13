<template>
  <div class="about">
    <h1>Ladda upp besiktningsfil</h1>
    <form id="besiktningform" action="http://localhost:8000/api/vehicles/upload" method="post">
    <div>
      <div>
        <input type="file" name="contents"/>
      </div>
      <div>
        <input type="submit" value="Ladda upp">
      </div>
      <div id="uploadResponse"></div>
    </div>
    </form>
  </div>
</template>

<script>
import {deserializeVehicleData} from "@/deserialize"
export default {
  name: "Upload",
  components: {

  },
  mounted() {
    // vi vill verifiera att datan inte innehåller errors, innan vi skickar. Då slipper vi onödiga roundtrips.
    document.getElementById("besiktningform").addEventListener("submit", async (evt) => {
      // vi vill förhindra att vi redirectas nånstans. Dessutom skall vi konstruera datan på klient-sidan innan den postas till servern
      evt.preventDefault();
      let fd = new FormData(evt.target);
      fd.get("contents").text().then(textContents => {
        let parsedData = deserializeVehicleData(textContents);
        const contents = {
          contents: parsedData.res
        };
        let request = new Request("http://localhost:8000/api/vehicles/upload", {
          method: "POST",
          body: JSON.stringify(contents),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetch(request)
        .then(async (r) => {
          if(r.ok) {
            return r.json();
          } else {
            throw new Error(await r.json().then(r => r.message));
          }
        }).then(response => {
          let e = document.getElementById("uploadResponse");
          e.innerText = response.message;
        }).catch(err => {
          let e = document.getElementById("uploadResponse");
          e.innerText = `Uppladdning misslyckades: ${err}`;
        })
      })
    });
  },
};

</script>
<style scoped>

#besiktningform textarea {
  min-width: 1000px;
}

#uploadResponse {
  padding: 10px;
}
</style>