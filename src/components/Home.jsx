import axios from 'axios';
import React, { useEffect, useState } from 'react';

import "./Home.css";
import Pagination from './Pagination';

import { MdOutlineSave } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";

const Home = () => {
    const [userDataInDB, setUserDataInDB] = useState([]);
    const [userDataToDisplay, setuserDataToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);
    const [currentPageUsersData, setcurrentPageUsersDataData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        const lastPostIndex = currentPage * postPerPage;
        const firstPostIndex = lastPostIndex - postPerPage;
        setcurrentPageUsersDataData(userDataToDisplay.slice(firstPostIndex, lastPostIndex));
    }, [currentPage, userDataToDisplay , ]);

    const getAllUsers = () => {
        axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json").then((res) => {
            setuserDataToDisplay(res.data)
            setUserDataInDB(res.data);
        })
    }

    const allUserIdsOfCurPage = currentPageUsersData.map((user) => user.id);

    const isAllUsersSelected = selectedUserId.length == currentPageUsersData.length;
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUserId([]);
        } else if (isAllUsersSelected) {
            setSelectedUserId([]);

        } else {
            setSelectedUserId(allUserIdsOfCurPage);
        }
    };

    const clearChecked = () => {
        setSelectedUserId([]);
        setSelectAll(false);
    };

    const deleteUsersByIds = (ids) => {
        const newUsers = currentPageUsersData.filter((user) => !ids.includes(user.id));
        setcurrentPageUsersDataData(newUsers);
        setuserDataToDisplay(userDataToDisplay.filter((user) => !ids.includes(user.id)));
        setSelectedUserId((prevSelected) =>
            prevSelected.filter((id) => !ids.includes(id))
        );
    }

    const handleSearch = (searchText) => {
        const filteredUsers = userDataInDB.filter((user) => {
            const { name, email, role } = user;
            return (
                name.toLowerCase().includes(searchText.toLowerCase()) ||
                email.toLowerCase().includes(searchText.toLowerCase()) ||
                role.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        setuserDataToDisplay(filteredUsers);
    }

    const handleEdit = (i) => {
        setEditData(userDataToDisplay[i - 1]);
    }

    const updateUser = (editedUser) => {
        const updatedUsers = userDataToDisplay.map((user) =>
            user.id === editedUser.id ? { ...user, ...editedUser } : user
        );
        setuserDataToDisplay(updatedUsers);
    };

    return (
        <>
            <div className='pageTitle'>
                <h1>Admin UI</h1>
            </div>

            <input type="text" className='SearchInput' placeholder='Search by name,email or role' onChange={(e) => handleSearch(e.target.value)} />

            <table className='table'>
                <thead>
                    <tr className='tableHeading' key="tableHeading">
                        <th>  <input type="checkbox" checked={selectAll || isAllUsersSelected} onChange={handleSelectAll} /></th>
                        <th>Name </th>
                        <th>Email </th>
                        <th>Role </th>
                        <th>Action </th>
                    </tr>
                </thead>

                <tbody>
                    {currentPageUsersData.map((user, idx) => {
                        return (
                            <tr key={idx}>
                                <td>
                                    <input type="checkbox" checked={selectedUserId.includes(user.id)} onChange={() => {
                                        setSelectedUserId((prevSelected) =>
                                            prevSelected.includes(user.id)
                                                ? prevSelected.filter((id) => id !== user.id) // Remove if already selected
                                                : [...prevSelected, user.id] // Add if not selected
                                        );
                                    }} />

                                </td>

                                <td>
                                    {editData.id === user.id ? (
                                        <>
                                            <input type="text" className='editInputField' value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                        </>
                                    ) : (
                                        <>
                                            {user.name}
                                        </>
                                    )}
                                </td>

                                <td>
                                    {editData.id === user.id ? (
                                        <>
                                            <input type="text" className='editInputField' value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                                        </>
                                    ) : (
                                        <>
                                            {user.email}
                                        </>
                                    )}
                                </td>

                                <td>
                                    {editData.id === user.id ? (
                                        <>
                                            <input type="text" className='editInputField' value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} />
                                        </>
                                    ) : (
                                        <>
                                            {user.role}
                                        </>
                                    )}
                                </td>

                                <td className='actionBtn'>
                                    {editData.id === user.id ? (
                                        <>
                                            <button className='saveBtn' onClick={() => {
                                                updateUser(editData)
                                                setEditData({});
                                            }}><MdOutlineSave /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='editBtn' onClick={() => {
                                                handleEdit(user.id);
                                            }}><BiSolidEditAlt /></button>
                                        </>
                                    )}
                                    <button className='deleteBtn' onClick={() => {
                                        deleteUsersByIds([user.id]);
                                    }}><RiDeleteBinFill /></button>

                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>

            <div className='paginationContainer'>
                <button className='deleteSelectedBtn' onClick={() => {
                    deleteUsersByIds(selectedUserId);
                }}>Delete Selected</button>

                <Pagination totalPosts={userDataToDisplay.length} postPerPage={postPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} clearChecked={clearChecked} />

            </div>
        </>
    );
}

export default Home;