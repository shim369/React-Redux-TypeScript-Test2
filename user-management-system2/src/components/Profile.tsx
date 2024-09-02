import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types/user';
import { fetchUserById, updateUserById } from '../redux/usersSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(Number(id)))
        .unwrap()
        .then((userData: User) => {
          setName(userData.name);
          setEmail(userData.email);
          setPassword('');
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch user data.');
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (id) {
      const updateData = { name, email, password: password || undefined };

      dispatch(updateUserById({ id: Number(id), ...updateData }))
        .unwrap()
        .then(() => navigate('/'))
        .catch(() => setError('Failed to update user.'));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Edit</h2>
      <form className='form' onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            id="password"
            type="password"
            value={password}
            autoComplete="off" 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password if you want to change it"
          />
        </div>
        <button className='btn' type="submit">Update</button>
      </form>
    </div>
  );
};

export default Profile;
