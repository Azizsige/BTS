<template>
  <DashboardNavbar />
  <Sidebars />
  <div class="p-4 sm:ml-64 font-Roboto">
    <div class="p-4 mt-14">
      <div class="mb-6 heading">
        <router-link
          to="/dashboard"
          class="flex items-center mb-4 text-secondaryColor hover:text-secondaryColor/80"
        >
          <svg
            class="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Checklists
        </router-link>
        <h1 class="text-[48px] text-secondaryColor font-bold">
          {{ checklist?.name || 'Untitled Checklist' }}
        </h1>
        <p class="text-[#414141] text-[18px]">
          {{ completedItemsLength }} / {{ itemsLength }} items completed
        </p>
      </div>

      <!-- Form untuk menambah item baru -->
      <form v-if="showAddItem" class="mt-6">
        <div class="mb-4">
          <input
            type="text"
            v-model="newItemName"
            id="new-item"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-lg font-bold rounded-lg focus:ring-secondaryColor focus:border-secondaryColor block w-full p-2.5"
            placeholder="New item"
            required
          />
        </div>
        <div class="flex space-x-2">
          <button
            @click.prevent="addItem"
            type="submit"
            :disabled="isAddingItem"
            class="text-white bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
          >
            {{ isAddingItem ? 'Adding...' : 'Add Item' }}
          </button>
          <button
            @click.prevent="showAddItem = false"
            type="button"
            class="text-secondaryColor bg-transparent border-2 border-secondaryColor hover:bg-gray-100 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Tombol untuk menampilkan form item -->
      <button
        v-if="!showAddItem"
        @click.prevent="showAddItem = true"
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
        Add New Item
      </button>

      <!-- Daftar item -->
      <div v-if="loading" class="mt-10">
        <div class="text-center text-gray-500">Loading items...</div>
      </div>
      <div v-else-if="itemsLength === 0" class="mt-10">
        <div
          class="p-6 text-center text-white rounded-lg shadow bg-secondaryColor"
        >
          <h5 class="text-2xl font-bold">No Items</h5>
        </div>
      </div>
      <div v-else class="mt-10 space-y-4">
        <div
          v-for="item in checklist?.items"
          :key="item.id"
          class="flex items-center p-4 space-x-2 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md"
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
              :disabled="isUpdatingItem"
              class="w-full text-white bg-secondaryColor hover:bg-secondaryColor/90 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
            >
              {{ isUpdatingItem ? 'Updating...' : 'Update Item' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardNavbar from "./../components/DashboardNavbar.vue";
import Sidebars from "./../components/Sidebars.vue";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { useStore } from '../stores/store.js';

const route = useRoute();
const store = useStore();
const loading = ref(true);
const showAddItem = ref(false);
const newItemName = ref('');
const showFormModalItem = ref(false);
const checklistId = ref(null);
const itemId = ref(null);
const itemName = ref('');
const isAddingItem = ref(false);
const isUpdatingItem = ref(false);

const checklist = computed(() => {
  return store.dataUser?.find((c) => c.id === Number(route.params.id)) || null;
});
const itemsLength = computed(() => checklist.value?.items?.length || 0);
const completedItemsLength = computed(() =>
  checklist.value?.items?.filter((item) => item.itemCompletionStatus).length || 0
);

const addItem = async () => {
  if (!Number.isInteger(Number(route.params.id))) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid checklist ID',
    });
    return;
  }
  if (!newItemName.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Item name is required',
    });
    return;
  }
  isAddingItem.value = true;
  try {
    await store.addItem(Number(route.params.id), newItemName.value.trim());
    newItemName.value = '';
    showAddItem.value = false;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to add item',
    });
  } finally {
    isAddingItem.value = false;
  }
};

const getFormUpdateItem = (checklistId, itemId, name) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid ID',
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
      icon: 'error',
      title: 'Invalid ID',
    });
    return;
  }
  if (!itemName.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Item name is required',
    });
    return;
  }
  isUpdatingItem.value = true;
  try {
    await store.updateItem(checklistId.value, itemId.value, itemName.value.trim());
    showFormModalItem.value = false;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to update item',
    });
  } finally {
    isUpdatingItem.value = false;
  }
};

const deleteItem = async (checklistId, itemId) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid ID',
    });
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    text: 'This item will be deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF4F5A',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await store.deleteItem(checklistId, itemId);
        Swal.fire('Deleted!', 'Item has been deleted.', 'success');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete item',
        });
      }
    }
  });
};

const updateItemStatus = async (checklistId, itemId, isDone) => {
  if (!Number.isInteger(checklistId) || !Number.isInteger(itemId)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid ID',
    });
    return;
  }
  try {
    await store.updateItemStatus(checklistId, itemId, isDone);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to update item status',
    });
  }
};

onMounted(async () => {
  await initFlowbite();
  if (!store.dataUser) {
    await store.getData();
  }
  loading.value = false;
});
</script>

<style lang="css" scoped>
.wrapper {
  min-height: 100vh;
}
</style>