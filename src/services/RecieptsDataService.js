import http from "../http-common";

class RecieptsDataService {
  getAll() {
    return http.get("/reciepts");
  }

  get(id) {
    return http.get(`/reciepts/${id}`);
  }

  create(data) {
    return http.post("/reciepts", data);
  }

  update(id, data) {
    return http.put(`/reciepts/${id}`, data);
  }

  delete(id) {
    return http.delete(`/reciepts/${id}`);
  }

  deleteAll() {
    return http.delete(`/reciepts`);
  }

  findByClient(client) {
    return http.get(`/reciepts?client=${client}`);
  }
}

export default new RecieptsDataService();