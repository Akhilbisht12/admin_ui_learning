import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/users";
import trash from "../../assets/trash.png";
import edit from "../../assets/edit.png";
import done from "../../assets/checked.png";

type iUser = { name: string; email: string; role: string; id: string };
const Users = () => {
  const [users, setUsers] = useState<iUser[]>([]); // for api clean data
  const [userDisplay, setUserDisplay] = useState<iUser[]>([]); // for filters and pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(new Set<string>());
  const [pageCheck, setPageCheck] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const pageLimit = Math.round(users.length / 10);

  const filterWithSearch = () => {
    const filteredResults = users.filter(
      (item) => item.name.includes(search) || item.email.includes(search) || item.role.includes(search)
    );
    setUserDisplay(filteredResults);
  };

  // select functions

  const checkItem = (index: string) => {
    const values = new Set(selected);
    if (selected.has(index)) {
      values.delete(index);
      setSelected(values);
    } else {
      values.add(index);
      setSelected(values);
    }
  };

  const selectAllInDisplay = () => {
    const values = new Set(selected);
    for (let i = page * 10; i < page * 10 + 10; i++) {
      if (values.has(users[i].id)) {
        values.delete(users[i].id);
      } else {
        values.add(users[i].id);
      }
    }
    setSelected(values);
  };

  // delete functions

  const deleteAllSelected = () => {
    const postDelUsers = users.filter((item) => !selected.has(item.id));
    setUsers(postDelUsers);
    setUserDisplay(postDelUsers);
  };

  const handleSingleDelete = (id: string) => {
    const postDeleteUsers = users.filter((item) => item.id !== id);
    setUserDisplay(postDeleteUsers);
    setUsers(postDeleteUsers);
  };

  // pagination

  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < Math.round(users.length / 10); i++) {
      pages.push(
        <div
          key={i}
          onClick={() => setPage(i)}
          className={`${
            page === i ? "bg-emerald-500 text-white" : "bg-white text-emerald-900"
          } h-12 w-12 items-center justify-center flex mx-1 rounded-full border-2 border-white`}
        >
          {i + 1}
        </div>
      );
    }
    return pages;
  };

  // edit functions

  const editName = (id: string, value: string) => {
    const index = users.findIndex((item) => item.id === id);
    setUsers((state) => {
      if (index !== -1) {
        state[index].name = value;
        setUserDisplay([...state]);
      }
      return [...state];
    });
  };

  const editEmail = (id: string, value: string) => {
    const index = users.findIndex((item) => item.id === id);
    setUsers((state) => {
      if (index !== -1) {
        state[index].email = value;
      }
      setUserDisplay([...state]);
      return [...state];
    });
  };

  // fetching users data on page load
  useEffect(() => {
    (async function () {
      const userResponse = await getAllUsers();
      setUsers(userResponse);
      setUserDisplay(userResponse);
    })();
  }, []);

  //  checking if entries in page are selected
  useEffect(() => {
    if (users.length === 0) return;
    let value = true;
    for (let i = page * 10; i < page * 10 + 10; i++) {
      if (!selected.has(users[i].id)) {
        value = false;
        break;
      }
    }
    setPageCheck(value);
  }, [page, selected, users]);

  return (
    <div className="p-4 bg-emerald-500 h-screen">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            filterWithSearch();
          }
        }}
        onBlur={() => filterWithSearch()}
        placeholder="Search by Name, Email or Role"
        className="w-full bg-white rounded-lg h-12 px-4 outline-none"
      />
      <div className="p-4 my-2 bg-white rounded-lg w-full">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>
                <input checked={pageCheck} onChange={() => selectAllInDisplay()} type="checkbox" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
            {userDisplay.slice(page * 10, page * 10 + 10).map((item, index) => {
              return (
                <tr key={item.id} className="h-8">
                  <td>
                    <input
                      checked={selected.has(item.id)}
                      onChange={() => checkItem(item.id)}
                      type="checkbox"
                    />
                  </td>
                  {editIndex === index ? (
                    <td>
                      <input
                        value={item.name}
                        onChange={(e) => editName(item.id, e.target.value)}
                        className="outline-none border-2 border-emerald-500 px-4 rounded"
                      />
                    </td>
                  ) : (
                    <td className="capitalize">{item.name}</td>
                  )}
                  {editIndex === index ? (
                    <td>
                      <input
                        value={item.email}
                        onChange={(e) => editEmail(item.id, e.target.value)}
                        className="outline-none border-2 border-emerald-500 px-4 rounded"
                      />
                    </td>
                  ) : (
                    <td className="capitalize">{item.email}</td>
                  )}
                  <td className="capitalize">{item.role}</td>
                  <td>
                    {editIndex === index ? (
                      <button onClick={() => setEditIndex(-1)}>
                        <img src={done} alt="done" className="w-6 h-6" />
                      </button>
                    ) : (
                      <button onClick={() => setEditIndex(index)}>
                        <img src={edit} alt="edit" className="w-6 h-6" />
                      </button>
                    )}
                    <button onClick={() => handleSingleDelete(item.id)}>
                      <img src={trash} alt="delete" className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </thead>
        </table>
      </div>
      <button onClick={deleteAllSelected} className="bg-red-600 px-6 py-2 rounded text-white">
        Delete
      </button>

      {/* pagination */}
      <div className="flex items-center justify-center">
        {/* move to index 1 button */}
        <div
          onClick={() => setPage(0)}
          className="bg-white  text-emerald-900 h-12 w-12 items-center justify-center flex mx-1 rounded-full"
        >
          {"<<"}
        </div>
        {/* back button */}
        <div
          onClick={() => {
            if (page - 1 < 0) return;
            setPage(page - 1);
          }}
          className="bg-white  text-emerald-900 h-12 w-12 items-center justify-center flex mx-1 rounded-full"
        >
          {"<"}
        </div>
        {/* all pages will rendered here */}
        {renderPages()}

        {/* forward button */}
        <div
          onClick={() => {
            if (page + 1 > pageLimit - 1) return;
            setPage(page + 1);
          }}
          className="bg-white text-emerald-900 h-12 w-12 items-center justify-center flex mx-1 rounded-full"
        >
          {">"}
        </div>
        {/* move to last index button */}
        <div
          onClick={() => setPage(Math.round(users.length / 10) - 1)}
          className="bg-white text-emerald-900 h-12 w-12 items-center justify-center flex mx-1 rounded-full"
        >
          {">>"}
        </div>
      </div>
    </div>
  );
};

export default Users;
