import { Routes, Route } from "react-router-dom";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/register" element={<UserForm />} />
    </Routes>
  );
}

export default MyRouter;
