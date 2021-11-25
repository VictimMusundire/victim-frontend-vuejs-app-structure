import http from "../http-common";
import authHeader from './auth-header';

class ManagementService {
  getAllUsers() {
    return http.get("/Management", { headers: authHeader() });
  }

  getAllRoles() {
    return http.get("/Roles", { headers: authHeader() });
  }

  getUser(id) {
    return http.get(`/Management/${id}`, { headers: authHeader() });
  }

  addUser_Role(id, data) {
    return http.put(`/Management/add_roles/${id}`, data, { headers: authHeader() });
  }

  removeUser_Role(id, data) {
    return http.put(`/Management/remove_roles/${id}`, data, { headers: authHeader() });
  }

  updateUser(id, data) {
    return http.put(`/Management/${id}`, data, { headers: authHeader() });
  }

  changePassword(id, password, data) {
    return http.put(`/Management/change_password/${id}/${password}`, data, { headers: authHeader() });
  }

  deleteUser(id) {
    return http.delete(`/Management/${id}`, { headers: authHeader() });
  }

  findByUsername(username) {
    return http.get(`/Management/?username=${username}`, { headers: authHeader() });
  }
}

export default new ManagementService();