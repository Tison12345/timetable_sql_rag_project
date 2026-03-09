// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true, // send cookies automatically
// });

// let isRefreshing = false;
// let failedQueue = [];

// // Process queued requests after refresh finishes
// const processQueue = (error) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve();
//     }
//   });

//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 403 &&
//       !originalRequest._retry &&
//       originalRequest.url !== "/auth/refresh"
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => api(originalRequest))
//           .catch((err) => {
//             throw err;
//           });
//       }

//       isRefreshing = true;

//       try {
//         await api.post("/auth/refresh");

//         processQueue(null);
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);
//         window.location.href = "/login";
//         throw refreshError;
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     throw error;
//   }
// );

// export default api;