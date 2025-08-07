
<template>
  <div class="wrapper bg-thirdColor">
    <div
      class="flex items-center justify-center h-screen mx-auto wrapper-container"
    >
      <div
        class="container-card bg-white shadow-lg w-[90%] lg:w-[512px] p-4 lg:p-7"
      >
        <div
          class="flex items-center card-header text-[36px] text-secondaryColor font-light space-x-2 font-Rowdies"
        >
          <img src="/img/icon.png" alt="" srcset="" />
          <p>Todo Daily</p>
        </div>
        <div class="mt-5 card-form">
          <div class="mb-5 form__header">
            <p class="text-[24px] font-Rowdies">Login</p>
          </div>

          <form>
            <div class="mb-6">
              <label
                for="identifier"
                class="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                >Username or Email :
              </label>
              <input
                type="text"
                v-model="identifier"
                id="identifier"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username or email"
                required
              />
            </div>
            <div class="mb-6">
              <div class="wrapper-input">
                <label
                  for="password"
                  class="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                  >Password :
                </label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    id="password"
                    class="block w-full p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondaryColor focus:border-secondaryColor"
                    placeholder="Password"
                    required
                  />
                  <button
                    @click="togglePassword"
                    type="button"
                    class="text-white absolute right-2.5 bottom-2.5 bg-transparent font-medium rounded-lg text-sm px-4 py-2"
                  >
                    <font-awesome-icon
                      class="text-secondaryColor"
                      :icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                    />
                  </button>
                </div>
              </div>
              <div class="font-bold wrapper-forgotPassword text-end">
                <router-link
                  to="/forgot-password"
                  class="text-sm text-secondaryColor"
                  >Forgot Password ?</router-link
                >
              </div>
            </div>

            <button
              type="submit"
              @click.prevent="login"
              class="text-white bg-secondaryColor focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Login
            </button>

            <div class="mt-5 text-center footer">
              <hr class="mt-10 border-secondaryColor" />
              <p class="mt-3 text-[18px] font-bold">
                Not have account ?
                <router-link to="/register" class="text-secondaryColor"
                  >Register</router-link
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "./../stores/store.js";
import { useToast } from "vue-toastification";
import { useCookies } from "vue3-cookies";
import Swal from "sweetalert2";

const toast = useToast();
const router = useRouter();
const store = useStore();
const { cookies } = useCookies();

const showPassword = ref(false);
const identifier = ref("");
const password = ref("");

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = () => {
  Swal.fire({
    title: "Please Wait...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  axios
    .post("http://94.74.86.174:8080/api/login", {
      username: identifier.value,
      password: password.value,
    })
    .then((res) => {
      console.log("Response:", res.data); // Debugging respons
      Swal.fire({
        icon: "success",
        title: `${res.data.message}`,
        text: "Login berhasil!",
      }).then(() => {
        console.log(res)
        // // Simpan data ke store
        store.isUserLoggedIn = true;
        store.userNameStore = identifier.value;
        store.accessToken = res.data.data.token || null; // Simpan accessToken jika ada
        console.log('token', res.data.data.token)
        cookies.set("accessToken", res.data.data.token);

        // // Simpan accessToken ke cookie jika diperlukan
        // if (res.data.accessToken) {
        // }

        console.log("Navigating to /dashboard"); // Debugging redirect
        router.push("/dashboard");
      });
    })
    .catch((error) => {
      Swal.close();
      console.error("Error:", error.response?.data); // Debugging error
      let errorValidation = error.response?.data?.errorMessage || [];
      let errorAuth = error.response?.data?.message || "Terjadi kesalahan saat login";

       toast.error(errorValidation, {
            position: "top-right",
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false,
          });

    });
};

onMounted(() => {
  store.dataUser = null;
  if (store.isUserLoggedIn) {
    router.push("/dashboard");
  }
});
</script>

<style lang="css" scoped>
.wrapper {
  min-height: 100vh;
}

.container-card {
  border-radius: 12px;
}
</style>