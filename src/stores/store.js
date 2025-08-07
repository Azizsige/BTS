import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";

export const useStore = defineStore("store", {
  state: () => ({
    user: null,
    auth: false,
    accessToken: null,
    userFullNameStore: null,
    userNameStore: null,
    userEmailStore: null,
    userIdStore: null,
    userJenisKelamin: null,
    dataUser: null,
    isUserLoggedIn: false,
    isSwalShown: false,
    isRefreshingToken: false,
    isTodoAdded: false,
    isTodoUpdated: false,
    isTodoDeleted: false,
    isTodoDone: false,
    isTokenExpiredAlertShown: false,
    isRefreshingTokenStatus: false,
  }),
  getters: {
    getTodoLength() {
      return this.dataUser ? this.dataUser.length : 0;
    },
    getIsDoneLength() {
      return this.dataUser ? this.dataUser.filter((checklist) => checklist.checklistCompletionStatus).length : 0;
    },
  },
  actions: {
    async getData() {
      if (!this.isUserLoggedIn) {
        this.dataUser = null;
        return;
      }
      try {
        const response = await axios.get("http://94.74.86.174:8080/api/checklist", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        if (response.data.statusCode === 2100) {
          this.dataUser = response.data.data;
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.getData();
          }
        } else {
          this.dataUser = null;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to fetch data",
          });
        }
      }
    },
    async getItem(checklistId, itemId) {
      if (!this.isUserLoggedIn) return null;
      try {
        const response = await axios.get(
          `http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        if (response.data.statusCode === 2100) {
          return response.data.data;
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            return await this.getItem(checklistId, itemId);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to fetch item",
          });
          return null;
        }
      }
    },
    async addChecklist(name) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.post(
          "http://94.74.86.174:8080/api/checklist",
          { name },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoAdded = true;
          await this.getData();
          Swal.fire({
            icon: "success",
            title: "Checklist Added",
          });
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.addChecklist(name);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to add checklist",
          });
        }
      }
    },
    async addItem(checklistId, name) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.post(
          `http://94.74.86.174:8080/api/checklist/${checklistId}/item`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoAdded = true;
          await this.getData();
          Swal.fire({
            icon: "success",
            title: "Item Added",
          });
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.addItem(checklistId, name);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to add item",
          });
        }
      }
    },
    async updateChecklist(id, name) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.put(
          `http://94.74.86.174:8080/api/checklist/${id}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoUpdated = true;
          await this.getData();
          Swal.fire({
            icon: "success",
            title: "Checklist Updated",
          });
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.updateChecklist(id, name);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to update checklist",
          });
        }
      }
    },
    async updateItem(checklistId, itemId, name) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.put(
          `http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoUpdated = true;
          await this.getData();
          Swal.fire({
            icon: "success",
            title: "Item Updated",
          });
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.updateItem(checklistId, itemId, name);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to update item",
          });
        }
      }
    },
    async deleteChecklist(id) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.delete(`http://94.74.86.174:8080/api/checklist/${id}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        if (response.data.statusCode === 2100) {
          this.isTodoDeleted = true;
          await this.getData();
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.deleteChecklist(id);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete checklist",
          });
        }
      }
    },
    async deleteItem(checklistId, itemId) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.delete(
          `http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoDeleted = true;
          await this.getData();
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.deleteItem(checklistId, itemId);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete item",
          });
        }
      }
    },
    async updateItemStatus(checklistId, itemId, isDone) {
      if (!this.isUserLoggedIn) return;
      try {
        const response = await axios.patch(
          `http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`,
          { itemCompletionStatus: isDone },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.statusCode === 2100) {
          this.isTodoDone = true;
          await this.getData();
        }
      } catch (error) {
        if (error.response?.data?.message === "Invalid token or token expired") {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            await this.refreshToken();
            this.isRefreshingToken = false;
            await this.updateItemStatus(checklistId, itemId, isDone);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to update item status",
          });
        }
      }
    },
    async logout() {
      try {
        await axios.post(
          `http://94.74.86.174:8080/api/auth/logout`,
          { userId: this.userIdStore },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
        });
        this.isUserLoggedIn = false;
        this.accessToken = null;
        this.userNameStore = null;
        this.userEmailStore = null;
        this.userIdStore = null;
        this.userJenisKelamin = null;
        this.userFullNameStore = null;
        this.dataUser = null;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to logout",
        });
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post(
          `http://94.74.86.174:8080/api/auth/refresh-token`,
          { userId: this.userIdStore },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status) {
          this.isRefreshingTokenStatus = response.data.status;
          this.accessToken = response.data.accessToken;
          await this.getData();
        }
      } catch (error) {
        this.accessToken = null;
        this.userEmailStore = null;
        this.userFullNameStore = null;
        this.userIdStore = null;
        this.userJenisKelamin = null;
        this.userNameStore = null;
        this.isRefreshingTokenStatus = false;
        if (!this.isTokenExpiredAlertShown) {
          this.isTokenExpiredAlertShown = true;
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Please log in again",
            showConfirmButton: true,
            confirmButtonText: "Login",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.isUserLoggedIn = false;
              location.reload();
            }
          });
        }
      }
    },
  },
  persist: {
    paths: [
      "isUserLoggedIn",
      "userNameStore",
      "userEmailStore",
      "userJenisKelamin",
      "userFullNameStore",
      "userIdStore",
      "accessToken",
    ],
  },
});