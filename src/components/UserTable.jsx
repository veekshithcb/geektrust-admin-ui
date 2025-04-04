
import React from 'react';
import { MdOutlineSave } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";

import './UserTable.css'; 

const UserTable = ({
  users,
  selectedUserId,
  setSelectedUserId,
  selectAll,
  setSelectAll,
  handleEdit,
  editData,
  setEditData,
  updateUser,
  deleteUsersByIds
}) => {
  const allUserIdsOfCurPage = users.map((user) => user.id);
  const isAllUsersSelected = selectedUserId.length === users.length;

  const handleSelectAll = () => {
    if (selectAll || isAllUsersSelected) {
      setSelectedUserId([]);
      setSelectAll(false);
    } else {
      setSelectedUserId(allUserIdsOfCurPage);
      setSelectAll(true);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr className="tableHeading">
          <th>
            <input type="checkbox" checked={selectAll || isAllUsersSelected} onChange={handleSelectAll} />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="checkbox"
                checked={selectedUserId.includes(user.id)}
                onChange={() => {
                  setSelectedUserId((prevSelected) =>
                    prevSelected.includes(user.id)
                      ? prevSelected.filter((id) => id !== user.id)
                      : [...prevSelected, user.id]
                  );
                }}
              />
            </td>

            {["name", "email", "role"].map((field) => (
              <td key={field}>
                {editData.id === user.id ? (
                  <input
                    type="text"
                    className="editInputField"
                    value={editData[field]}
                    onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                  />
                ) : (
                  user[field]
                )}
              </td>
            ))}

            <td className="actionBtn">
              {editData.id === user.id ? (
                <button
                  className="saveBtn"
                  onClick={() => updateUser(editData)}
                >
                  <MdOutlineSave />
                </button>
              ) : (
                <button
                  className="editBtn"
                  onClick={() => handleEdit(user.id)}
                >
                  <BiSolidEditAlt />
                </button>
              )}
              <button className="deleteBtn" onClick={() => deleteUsersByIds([user.id])}>
                <RiDeleteBinFill />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
