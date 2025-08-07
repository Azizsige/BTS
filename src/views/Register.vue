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
            <p class="text-[24px] font-Rowdies">Signin</p>
          </div>

          <form>
            <div class="overflow-x-hidden wrapper-form">
              <div class="relative z-10 form">
                <div
                  :class="nextForm ? 'scale-100' : 'scale-0'"
                  v-auto-animate
                  class="w-full firstPage"
                >
                  <div class="mb-6">
                    <label
                      for="username"
                      class="block mb-2 text-lg font-bold text-black dark:text-white"
                      >Username :
                    </label>
                    <input
                      type="text"
                      id="username"
                      v-model="username"
                      class="bg-gray-50 border border-gray-300 text-black text-md rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Your Username"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                      >Email :
                    </label>
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div class="mb-6">
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
                </div>
                <div
                  v-auto-animate
                  class="absolute top-0 w-full transition-all lastPage"
                  :class="nextForm ? 'scale-0' : 'scale-100'"
                >
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                      >Email :
                    </label>
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div class="mb-6">
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
                  <div class="">
                    <label
                      for="confirm_password"
                      class="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                      >Confirm Password :
                    </label>
                    <div class="relative">
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="confirm_password"
                        id="confirm_password"
                        class="block w-full p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondaryColor focus:border-secondaryColor"
                        placeholder="Confirm Your Password"
                        required
                      />
                      <button
                        @click="toggleConfirmPassword"
                        type="button"
                        class="text-white absolute right-2.5 bottom-2.5 bg-transparent font-medium rounded-lg text-sm px-4 py-2"
                      >
                        <font-awesome-icon
                          class="text-secondaryColor"
                          :icon="
                            showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                          "
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 button-footer">
              <button
                type="button"
                @click="nextFormPage"
                class="text-white bg-secondaryColor focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center mb-4"
              >
                {{ nextForm ? 'Next' : 'Back' }}
              </button>
              <button
                type="submit"
                @click.prevent="register"
                class="text-white bg-secondaryColor focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              >
                Register
              </button>
            </div>

            <div class="mt-5 text-center footer">
              <hr class="mt-10 border-secondaryColor" />
              <p class="mt-3 text-[18px] font-bold">
                Already have account ?
                <router-link to="/login" class="text-secondaryColor"
                  >Login</router-link
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
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "./../stores/store.js";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();
const router = useRouter();
const store = useStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const password = ref("");
const username = ref("");
const email = ref("");
const confirm_password = ref("");
const nextForm = ref(true);

const nextFormPage = () => {
  nextForm.value = !nextForm.value;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const register = () => {
  // Validasi konfirmasi password jika di halaman kedua
  if (!nextForm.value && password.value !== confirm_password.value) {
    toast.error("Password dan konfirmasi password tidak sama!", {
      position: "top-right",
      timeout: 1500,
    });
    return;
  }

  Swal.fire({
    title: "Please Wait...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  axios
    .post("http://94.74.86.174:8080/api/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    .then((res) => {
      console.log("Response:", res.data); // Debugging respons
      Swal.fire({
        icon: "success",
        title: `${res.data.message}`,
        text: "Silahkan login untuk melanjutkan",
      }).then(() => {
        // Simpan data ke store
        console.log("Navigating to /login"); // Debugging redirect
        router.push("/login");
      });
    })
    .catch((error) => {
      Swal.close();
      console.error("Error:", error.response?.data); // Debugging error
      let err = error.response?.data?.errors || [];
      for (let key in err) {
        let msg = err[key].msg;
        toast.error(msg, {
          position: "top-right",
          timeout: 1500,
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
      }
    });
};

onMounted(() => {
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

.form {
  transition: transform 0.3s ease-in-out;
}

.firstPage,
.lastPage {
  transition: transform 0.3s ease-in-out;
}
</style>