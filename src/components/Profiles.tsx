import { useState } from "react";

//const names = ["Test test1", "Test test2", "Test test3", "Test test4"];
const defalutUsers = [
  {
    id: 1,
    name: "Test1 test1",
  },
  {
    id: 2,
    name: "Test test2",
  },
  {
    id: 3,
    name: "Test test3",
  },
  {
    id: 4,
    name: "Test test4",
  },
];

interface User {
  id: number;
  name: string;
}
export default function Profiles() {
  const [users, setUsers] = useState<User[]>(defalutUsers);
  const isLoggedIn = true;
  let content;

  function profileClick() {
    const id = users.length + 1;
    const newUser = {
      id,
      name: `user #${id}`,
    };
    setUsers([...users, newUser]);
    //alert("Hello " + name);
  }

  if (isLoggedIn) {
    content = <h1>Welcome!</h1>;
  } else {
    content = <h1>Please Login!</h1>;
  }

  return (
    <div>
      {users.map((user) => {
        return (
          <p key={user.id} onClick={() => profileClick()}>
            {user.name}
          </p>
        );
      })}
      bangkok boulevard
      {isLoggedIn ? <h1>TRUE</h1> : <h1>FALSE</h1>}
      {isLoggedIn && <h1>ONLY TRUE</h1>}
      {content}
    </div>
  );
}
