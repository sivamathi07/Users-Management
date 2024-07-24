import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import "./EmployeeTask.css";

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    employeeName: "",
    task: "",
    activity: "",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    progress: "",
    startDate: "",
    endDate: "",
    status: "pending", // New field for task status
    ourUsers:{
      id: ""
     } // Adding user id to the field
  });
  
  const [editTask, setEditTask] = useState(null); // edit task
  const [profileInfo, setProfileInfo] = useState({});
  const [isRestrictedTime, setIsRestrictedTime] = useState(false); // time restriction

  useEffect(() => {
    fetchProfileInfo(); //initial our userprofile verify rendering time
  }, []);

  //newly implement useeffect for ADMIN & USER employeetask list based on employee USERID
  useEffect(() => {
    if (profileInfo.role) {

      checkTimeRestriction(); // checking time
      if (!isRestrictedTime || profileInfo.role === "ADMIN") {

      if (profileInfo.role === "ADMIN") {
        fetchEmployeeAllTasks();
      } else {
        fetchEmployeeTasks(profileInfo.id);
      }
    }
  }
  }, [profileInfo, isRestrictedTime]);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.ourUsers);

      setNewTask((prevTask) => ({
        ...prevTask,
        ourUsers:{
          id : response.ourUsers.id // Set userId in newTask
        }
      }));

    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const fetchEmployeeTasks = async (userId) => {   //based on userId to fetch the employeetaskslist
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.fetchEmployeeTasksByuserId(token, userId);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching employee tasks:", error);
    }
  };

  const fetchEmployeeAllTasks = async () => {   //Admin user fetchallemployeetasks list
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.fetchEmployeeTasks(token);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching employee tasks:", error);
    }
  };

  const handleEditTask = (task) => {  // handle edit task
    setEditTask(task);
  };

  const handleUpdateTask = async () => {  // handle update task
    try {
        const token = localStorage.getItem("token");
        await UserService.updateEmployeeTask(editTask.id, editTask, token);
        setEditTask(null);

        if (profileInfo.role === "ADMIN") {
            fetchEmployeeAllTasks();
        } else {
            fetchEmployeeTasks(profileInfo.id);
        }
    } catch (error) {
        console.error("Error updating employee task:", error);
    }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  if (profileInfo.role !== "ADMIN") {
      if (editTask) {
          setEditTask((prev) => ({
              ...prev,
              [name]: value,
          }));
      } else {
          setNewTask((prev) => ({
              ...prev,
              [name]: value,
          }));
      }
  }
};

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const taskWithDates = { ...newTask };

      await UserService.createEmployeeTask(taskWithDates, token);

      if (profileInfo.role === "ADMIN") {  //based on userId to submit task only admin can do this
        fetchEmployeeAllTasks(); 
      } else {
        fetchEmployeeTasks(profileInfo.id);
      }

      setNewTask({
        employeeName: "",
        task: "",
        activity: "",
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 0,
        progress: "",
        startDate: "",
        endDate: "",
        status: "pending",
        ourUsers: {
          id: profileInfo.id // Reset to the current user's ID
        }
      });
    } catch (error) {
      console.error("Error creating employee task:", error);
    }
  };

  const handleClearAll = () => {
    setNewTask({
      employeeName: "",
      task: "",
      activity: "",
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      progress: "",
      startDate: "",
      endDate: "",
      status: "pending",
      ourUsers: {
        id: profileInfo.id // Reset to the current user's ID
      }
    });
  };

  const handleApproveTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await UserService.approveEmployeeTask(taskId, token);
      if (profileInfo.role === "ADMIN") {        //based on userID to approve task
        fetchEmployeeAllTasks();
      } else {
        fetchEmployeeTasks(profileInfo.id);
      }
    } catch (error) {
      console.error("Error approving employee task:", error);
    }
  };

  const checkTimeRestriction = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const restricted = currentHour >= 23 || currentHour < 6;
    setIsRestrictedTime(restricted);
  };
  
  return ( 
    <div className="employee-task-container"> <center>
      <h1>Employee Tasks</h1> 
      <p className="emp-details"> <center>
         Employee Name : {profileInfo.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
         User ID : {profileInfo.id} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
         User Role : {profileInfo.role} </center></p> <br></br> 
      
         {isRestrictedTime && profileInfo.role !== "ADMIN" ? (
        <p>Access to tasks is restricted between 11 PM and 6 AM. Please try again later.</p>
      ) : (
      
        <>
      <table className="employee-task-table" border="1">
        <thead>
          <tr>
            <th nowrap = "nowrap">Employee Name</th>
            <th>Task</th>
            <th>Activity</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Progress</th>
            <th>Status</th> {/* New column for task status */}
            {profileInfo.role === "ADMIN" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {/* {profileInfo.role === "ADMIN" && showTable && ( */}
            <>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.employeeName}</td>
                  <td nowrap = "nowrap">{task.task}</td>
                  <td nowrap = "nowrap">{task.activity}</td>
                  <td>{task.mon}</td>
                  <td>{task.tue}</td>
                  <td>{task.wed}</td>
                  <td>{task.thu}</td>
                  <td>{task.fri}</td>
                  <td>{task.sat}</td>
                  <td nowrap = "nowrap">{task.startDate}</td> {/*no wrap single line data*/}
                  <td nowrap = "nowrap">{task.endDate}</td>
                  <td>{task.progress}</td>
                  <td>{task.status}</td> {/* Display task status */}
                  <td>
                    {profileInfo.role === "ADMIN" && task.status === "pending" &&( // task status
                      <button className='employee-approve' onClick={() => handleApproveTask(task.id)}>
                        Approve
                      </button>
                    )}
                   
                   {profileInfo.role !== "ADMIN" && task.status === "pending" && (
                      <button className='employee-edit' onClick={() => handleEditTask(task)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </>
          {profileInfo.role !=="ADMIN" && ( // Admin user id can't enter the employee task details
          <tr>
            <td>
              <input
                type="text"
                name="employeeName"
                value={editTask ? editTask.employeeName : newTask.employeeName}
                onChange={handleChange}
                placeholder="Employee Name"
              />
            </td>
            <td>
              <input
                type="text"
                name="task"
                value={editTask ? editTask.task : newTask.task}
                onChange={handleChange}
                placeholder="Task"
              />
            </td>
            <td>
              <input
                type="text"
                name="activity"
                value={editTask ? editTask.activity : newTask.activity}
                onChange={handleChange}
                placeholder="Activity"
              />
            </td>
            <td>
              <input
                type="number"
                name="mon"
                value={editTask ? editTask.mon : newTask.mon}
                onChange={handleChange}
                placeholder="Mon"
              />
            </td>
            <td>
              <input
                type="number"
                name="tue"
                value={editTask ? editTask.tue : newTask.tue}
                onChange={handleChange}
                placeholder="Tue"
              />
            </td>
            <td>
              <input
                type="number"
                name="wed"
                value={editTask ? editTask.wed : newTask.wed}
                onChange={handleChange}
                placeholder="Wed"
              />
            </td>
            <td>
              <input
                type="number"
                name="thu"
                value={editTask ? editTask.thu : newTask.thu}
                onChange={handleChange}
                placeholder="Thu"
              />
            </td>
            <td>
              <input
                type="number"
                name="fri"
                value={editTask ? editTask.fri : newTask.fri}
                onChange={handleChange}
                placeholder="Fri"
              />
            </td>
            <td>
              <input
                type="number"
                name="sat"
                value={editTask ? editTask.sat : newTask.sat}
                onChange={handleChange}
                placeholder="Sat"
              />
            </td>

            <td>
            <input
              type="date"         // start date implementation
              id="startDate"
              name="startDate"
              value={editTask ? editTask.startDate : newTask.startDate}
              onChange={handleChange}
              placeholder="yyyy-mm-dd"
            />    
            </td>
            
            <td>
            <input
              type="date"     // end date implementation
              id="endDate"
              name="endDate"
              value={editTask ? editTask.endDate : newTask.endDate}
              onChange={handleChange}
              placeholder="yyyy-mm-dd"
            />
            </td>
            <td>
              <input
                type="text"
                name="progress"
                value={editTask ? editTask.progress : newTask.progress}
                onChange={handleChange}
                placeholder="Progress"
              />
            </td>
            <td>{editTask ? editTask.status : newTask.status}</td> {/* Display status for new task */}
          </tr>
          )}
        </tbody>
      </table>
      {profileInfo.role !== "ADMIN" &&(   //submit & clear button visible only USERS
      <div className="button-container">
        
        {editTask ? (
          <button className='button-submit' onClick={handleUpdateTask}>Update</button>
            ) : (
          <button className='button-submit' onClick={handleSubmit}>Add Task</button>
        )}

        <button  className='button-clearall' onClick={handleClearAll}>Clear All</button>
      </div>
      )}
      </>
      )} </center>
    </div>
  );
};

export default EmployeeTask;
