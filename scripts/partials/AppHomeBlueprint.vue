<template>
  <div class="space-y-4">
    <h3 v-text="heading" />
    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Varius bibendum ante mi magnis ex dictum. Magna in vulputate auctor vitae ipsum venenatis nam. Commodo egestas fames himenaeos tortor gravida curabitur torquent pulvinar. Congue vestibulum a leo dolor nulla magna. Sagittis commodo quam praesent odio efficitur commodo. Donec augue cras per lobortis orci. Bibendum phasellus enim porta montes orci vivamus conubia luctus. Convallis est diam lorem maximus platea laoreet ipsum. Mauris nulla parturient vel velit pellentesque est.
      <br/>
      Aliquam fames malesuada suspendisse placerat conubia proin; inceptos parturient iaculis. Aptent dapibus dui ipsum penatibus, suscipit odio quisque. Leo aptent pulvinar platea turpis ante torquent venenatis. Condimentum turpis laoreet egestas ridiculus elit aliquet faucibus dui. Ridiculus eu mollis magna eu dapibus suspendisse aptent tellus. Ultricies integer leo ligula at mollis parturient ipsum. Amet sagittis id natoque per curae condimentum id. Luctus ut lacinia fames donec parturient parturient congue natoque. Metus est magnis convallis dui habitant ultricies odio.
      <br/>
      Lorem inceptos sollicitudin suspendisse viverra eros gravida commodo hac ex. Diam bibendum massa velit dolor magna enim lectus nulla. Ipsum cubilia cubilia nam pretium lacus venenatis dolor tellus. Natoque nibh suspendisse mus pulvinar blandit nec facilisi. Nulla nulla elit ipsum a magnis semper. Magna accumsan nisi velit dictum eros.
      <br/>
      Dignissim habitasse mi dictum gravida sit finibus. Suspendisse leo ante magnis netus montes. Ultrices aptent ornare semper, potenti ultrices dui pulvinar feugiat tortor. Dignissim mattis vel turpis a vitae pulvinar blandit. Tempor velit habitant finibus egestas ullamcorper. Arcu phasellus ante a dapibus dolor dui vestibulum.
      <br/>
      Pharetra porta ullamcorper purus volutpat volutpat malesuada mi cras. Vestibulum porttitor porta aliquet facilisis; parturient velit venenatis. Ut varius phasellus hendrerit, interdum mi nullam. Ad risus phasellus euismod adipiscing felis dui justo eros. Vulputate sem facilisi libero sem per auctor suscipit dui. Suscipit porta ligula arcu id; pulvinar imperdiet erat.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const appName = ref('__APP_NAME');
const heading = computed(() => `Hello ${appName.value}!`);
</script>