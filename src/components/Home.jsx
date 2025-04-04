// Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from './UserTable';
import Pagination from './Pagination';

import './Home.css';
import Search from './Search';

const Home = () => {
  const [userDataInDB, setUserDataInDB] = useState([]);
  const [userDataToDisplay, setUserDataToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(10);
  const [currentPageUsersData, setCurrentPageUsersData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    setCurrentPageUsersData(userDataToDisplay.slice(firstPostIndex, lastPostIndex));
  }, [currentPage, userDataToDisplay]);

  const getAllUsers = async () => {
    const res = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    setUserDataToDisplay(res.data);
    setUserDataInDB(res.data);
  };

  const handleSearch = (searchText) => {
    const filteredUsers = userDataInDB.filter((user) => {
      const { name, email, role } = user;
      return (
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        email.toLowerCase().includes(searchText.toLowerCase()) ||
        role.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setUserDataToDisplay(filteredUsers);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    const user = userDataToDisplay.find((u) => u.id === id);
    setEditData(user);
  };

  const updateUser = (editedUser) => {
    const updatedUsers = userDataToDisplay.map((user) =>
      user.id === editedUser.id ? { ...user, ...editedUser } : user
    );
    setUserDataToDisplay(updatedUsers);
    setEditData({});
  };

  const deleteUsersByIds = (ids) => {
    const filteredUsers = userDataToDisplay.filter((user) => !ids.includes(user.id));
    setUserDataToDisplay(filteredUsers);
    setSelectedUserId((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const clearChecked = () => {
    setSelectedUserId([]);
    setSelectAll(false);
  };

  return (
    <div>
      <div className="pageTitle">
        <h1>Admin UI</h1>
      </div>

      <Search onSearch={handleSearch} />

      <UserTable
        users={currentPageUsersData}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        handleEdit={handleEdit}
        editData={editData}
        setEditData={setEditData}
        updateUser={updateUser}
        deleteUsersByIds={deleteUsersByIds}
      />

      <div className="paginationContainer">
        <button className="deleteSelectedBtn" onClick={() => deleteUsersByIds(selectedUserId)}>
          Delete Selected
        </button>

        <Pagination
          totalPosts={userDataToDisplay.length}
          postPerPage={postPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          clearChecked={clearChecked}
        />
      </div>
    </div>
  );
};

export default Home;
