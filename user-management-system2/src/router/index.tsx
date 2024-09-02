import { Routes, Route } from "react-router-dom";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import Profile from "../components/Profile";

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/register" element={<UserForm />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  );
}

export default MyRouter;
