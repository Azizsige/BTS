<template>
  <div class="p-4 sm:ml-64 font-Roboto">
    <div class="p-4 mt-14">
      <div class="heading">
        <h1 class="text-[48px] text-secondaryColor font-bold">My Checklists</h1>
        <p class="text-[#414141] text-[18px]">
          {{ completedTodoLength }} / {{ todoLength }} completed checklists
        </p>
      </div>

      <!-- Form untuk menambah checklist baru -->
      <form v-if="showAddChecklist" class="mt-6">
        <div class="mb-4">
          <input
            type="text"
            v-model="checklistName"
            id="checklistName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-lg font-bold rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5"
            placeholder="Checklist title"
            required
          />
        </div>
        <div class="flex space-x-2">
          <button
            @click.prevent="addChecklist"
            type="submit"
            class="text-white bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Add Checklist
          </button>
          <button
            @click.prevent="showAddChecklist = false"
            type="button"
            class="text-secondaryColor bg-transparent border-2 border-secondaryColor hover:bg-gray-100 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Tombol untuk menampilkan form checklist -->
      <button
        v-if="!showAddChecklist"
        @click.prevent="showAddChecklist = true"
        type="button"
        class="mt-6 text-secondaryColor font-medium rounded-lg text-lg py-2.5 flex items-center"
      >
        <svg
          class="w-6 h-6 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4v16m8-8H4"
            stroke="#FF4F5A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Add New Checklist
      </button>

      <!-- Daftar checklist -->
      <div v-if="loading === false" class="grid grid-cols-1 gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="n in 3"
          :key="n"
          class="h-64 bg-gray-200 rounded-lg shadow animate-pulse"
        ></div>
      </div>
      <div v-else-if="todoLength === 0" class="mt-10">
        <div
          class="p-6 text-center text-white rounded-lg shadow bg-secondaryColor"
        >
          <h5 class="text-2xl font-bold">No Checklists</h5>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="checklist in checklists"
          :key="checklist.id"
          class="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow hover:shadow-md"
        >
          <div class="flex items-center justify-between mb-4">
            <router-link
              :to="{ name: 'ChecklistDetail', params: { id: checklist.id } }"
              class="text-xl font-bold text-gray-900 hover:text-secondaryColor"
            >
              {{ checklist.name || 'Untitled Checklist' }}
            </router-link>
            <div class="flex space-x-2">
              <button
                @click.stop.prevent="getFormUpdateChecklist(checklist.id, checklist.name)"
                class="text-gray-500 hover:text-secondaryColor"
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click.stop.prevent="deleteChecklist(checklist.id)"
                class="text-secondaryColor hover:text-red-700"
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Daftar item dalam checklist -->
          <div v-if="!checklist.items || checklist.items.length === 0" class="text-center text-gray-500">
            No items in this checklist
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="item in checklist.items"
              :key="item.id"
              class="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                :id="'item-' + item.id"
                :checked="item.itemCompletionStatus"
                @change="updateItemStatus(checklist.id, item.id, $event.target.checked)"
                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-secondaryColor focus:ring-secondaryColor"
              />
              <label :for="'item-' + item.id" class="flex-1 text-gray-900">
                <span :class="{ 'line-through text-gray-500': item.itemCompletionStatus }">
                  {{ item.name || 'Untitled Item' }}
                </span>
              </label>
              <button
                @click.stop.prevent="getFormUpdateItem(checklist.id, item.id, item.name)"
                class="text-gray-500 hover:text-secondaryColor"
              >
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click.stop.prevent="deleteItem(checklist.id, item.id)"
                class="text-secondaryColor hover:text-red-700"
              >
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Form untuk menambah item baru -->
          <form v-if="showAddItem[checklist.id]" class="mt-4">
            <div class="mb-2">
              <input
                type="text"
                v-model="newItemName[checklist.id]"
                :id="'new-item-' + checklist.id"
                class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondaryColor focus:border-secondaryColor"
                placeholder="New item"
                required
              />
            </div>
            <div class="flex space-x-2">
              <button
                @click.prevent="addItem(checklist.id)"
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 focus:outline-none"
              >
                Add Item
              </button>
              <button
                @click.prevent="showAddItem[checklist.id] = false"
                type="button"
                class="px-4 py-2 text-sm font-medium bg-transparent border-2 rounded-lg text-secondaryColor border-secondaryColor hover:bg-gray-100 focus:ring-4 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
          <button
            v-if="!showAddItem[checklist.id]"
            @click.prevent="showAddItem[checklist.id] = true"
            class="mt-2 text-sm text-secondaryColor hover:text-secondaryColor/80"
          >
            + Add Item
          </button>
        </div>
      </div>

      <!-- Modal untuk update checklist -->
      <div
        v-if="showFormModalChecklist"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="relative w-full max-w-md p-6 bg-white rounded-lg shadow">
          <button
            @click.prevent="showFormModalChecklist = false"
            type="button"
            class="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <h3 class="mb-6 text-2xl font-bold text-center text-secondaryColor">Update Checklist</h3>
          <form class="space-y-4">
            <input
              v-model="checklistTitle"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5"
              placeholder="Checklist title"
              required
            />
            <button
              @click.prevent="updateChecklist"
              type="submit"
              class="w-full text-white bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Update Checklist
            </button>
          </form>
        </div>
      </div>

      <!-- Modal untuk update item -->
      <div
        v-if="showFormModalItem"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="relative w-full max-w-md p-6 bg-white rounded-lg shadow">
          <button
            @click.prevent="showFormModalItem = false"
            type="button"
            class="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <h3 class="mb-6 text-2xl font-bold text-center text-secondaryColor">Update Item</h3>
          <form class="space-y-4">
            <input
              v-model="itemName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5"
              placeholder="Item name"
              required
            />
            <button
              @click.prevent="updateItem"
              type="submit"
              class="w-full text-white bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Update Item
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { initFlowbite } from "flowbite";
import Swal from "sweetalert2";
import { useStore } from "./../stores/store.js";

const store = useStore();
const loading = ref(false);
const showAddChecklist = ref(false);
const checklistName = ref("");
const showAddItem = ref({});
const newItemName = ref({});
const showFormModalChecklist = ref(false);
const showFormModalItem = ref(false);
const checklistId = ref(null);
const checklistTitle = ref("");
const itemId = ref(null);
const itemName = ref("");

const checklists = computed(() => store.dataUser || []);
const todoLength = computed(() => checklists.value.length);
const completedTodoLength = computed(() =>
  checklists.value.filter((checklist) => checklist.checklistCompletionStatus).length
);

const renderData = async () => {
  loading.value = false;
  await store.getData();
  loading.value = true;
};

const addChecklist = async () => {
  if (!checklistName.value) {
    Swal.fire({
      icon: "error",
      title: "Checklist title is required",
    });
    return;
  }
  await store.addChecklist(checklistName.value);
  checklistName.value = "";
  showAddChecklist.value = false;
  renderData();
};

const addItem = async (checklistId) => {
  if (!Number.isInteger(checklistId)) {
    Swal.fire({
      icon: "error",
      title: "Invalid checklist ID",
    });
    return;
  }
  if (!newItemName.value[checklistId]) {
    Swal.fire({
      icon: "error",
      title: "Item name is required",
    });
    return;
  }
  await store.addItem(checklistId, newItemName.value[checklistId]);
  newItemName.value[checklistId] = "";
  showAddItem.value[checklistId] = false;
  renderData();
};

const getFormUpdateChecklist = (id, name) => {
  if (!Number.isInteger(id)) {
    Swal.fire({
      icon: "error",
      title: "Invalid checklist ID",
    });
    return;
  }
  checklistId.value = id;
  checklistTitle.value = name;
  showFormModalChecklist.value = true;
};

const updateChecklist = async () => {
  if (!Number.isInteger(checklistId.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid checklist ID",
    });
    return;
  }
  await store.updateChecklist(checklistId.value, checklistTitle.value);
  showFormModalChecklist.value = false;
  renderData();
};

const deleteChecklist = async (id) => {
  if (!Number.isInteger(id)) {
    Swal.fire({
      icon: "error",
      title: "Invalid checklist ID",
    });
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "This checklist will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF4F5A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await store.deleteChecklist(id);
      renderData();
      Swal.fire(
        "Deleted!",
        "Checklist has been deleted.",
        "success"
      );
    }
  });
};

const getFormUpdateItem = (checklistId, itemId, name) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: "error",
      title: "Invalid ID",
    });
    return;
  }
  checklistId.value = checklistId;
  itemId.value = itemId;
  itemName.value = name;
  showFormModalItem.value = true;
};

const updateItem = async () => {
  if (!Number.isInteger(checklistId.value) || !Number.isInteger(itemId.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid ID",
    });
    return;
  }
  await store.updateItem(checklistId.value, itemId.value, itemName.value);
  showFormModalItem.value = false;
  renderData();
};

const deleteItem = async (checklistId, itemId) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: "error",
      title: "Invalid ID",
    });
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "This item will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF4F5A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await store.deleteItem(checklistId, itemId);
      renderData();
      Swal.fire(
        "Deleted!",
        "Item has been deleted.",
        "success"
      );
    }
  });
};

const updateItemStatus = async (checklistId, itemId, isDone) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: "error",
      title: "Invalid ID",
    });
    return;
  }
  await store.updateItemStatus(checklistId, itemId, isDone);
  renderData();
};

onMounted(async () => {
  await initFlowbite();
  await renderData();
});
</script>

<style lang="css" scoped>
.wrapper {
  min-height: 100vh;
}
</style>