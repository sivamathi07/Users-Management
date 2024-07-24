import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:1010"

    // update employee task
    static async updateEmployeeTask(taskId, taskData, token) {
        try {
            const response = await axios.put(
                `${UserService.BASE_URL}/tasks/${taskId}`,
                taskData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    

      //newly created url mapping based on userID fetch the employee task
      static async fetchEmployeeTasksByuserId(token, userId) {
        try{
          const response = await axios.get(`${UserService.BASE_URL}/tasks/${userId}`,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
          } catch(err) {
              throw err;
          }
      }

    static async login(email, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }
    
    // Admin login anytime
   


    static async register(userData, token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

   static async fetchEmployeeTasks(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async createEmployeeTask(taskData, token) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/tasks`,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

static async setTaskDates(taskId, startDate, endDate, token) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/tasks/${taskId}/dates`,
        { startDate, endDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }


  static async approveEmployeeTask(taskId, token) { // approve button
    try {
        const response = await axios.put(
            `${UserService.BASE_URL}/tasks/${taskId}/approve`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
}


    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService;